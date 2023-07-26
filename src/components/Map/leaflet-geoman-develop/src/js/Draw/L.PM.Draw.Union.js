import lineIntersect from '@turf/line-intersect';
import lineSplit from '@turf/line-split';
import booleanContains from '@turf/boolean-contains';
import { union } from '@turf/turf';

import get from 'lodash/get';
import Draw from './L.PM.Draw';
import {
  difference,
  flattenPolyline,
  groupToMultiLineString,
  intersect,
} from '../helpers/turfHelper';

Draw.Union = Draw.Polygon.extend({
  initialize(map) {
    this._map = map;
    this._shape = 'Union';
    this.toolbarButtonName = 'unionPolygon';
  },
  _finishShape() {
    this._editedLayers = [];
    // if self intersection is not allowed, do not finish the shape!
    if (!this.options.allowSelfIntersection) {
      // Check if polygon intersects when is completed and the line between the last and the first point is drawn
      this._handleSelfIntersection(true, this._layer.getLatLngs()[0]);

      if (this._doesSelfIntersect) {
        return;
      }
    }

    // If snap finish is required but the last marker wasn't snapped, do not finish the shape!
    if (
      this.options.requireSnapToFinish &&
      !this._hintMarker._snapped &&
      !this._isFirstLayer()
    ) {
      return;
    }

    // get coordinates
    const coords = this._layer.getLatLngs();

    // only finish the shape if there are 3 or more vertices
    if (coords.length <= 2) {
      return;
    }

    const polygonLayer = L.polygon(coords, this.options.pathOptions);
    // readout information about the latlngs like snapping points
    polygonLayer._latlngInfos = this._layer._latlngInfo;
    this.cut(polygonLayer);

    // clean up snapping states
    this._cleanupSnapping();

    // remove the first vertex from "other snapping layers"
    this._otherSnapLayers.splice(this._tempSnapLayerIndex, 1);
    delete this._tempSnapLayerIndex;

    this._editedLayers.forEach(({ layer, originalLayer }) => {
      // fire pm:cut on the cutted layer
      this._fireCut(originalLayer, layer, originalLayer);

      // fire pm:cut on the map
      this._fireCut(this._map, layer, originalLayer);

      // fire edit event after cut
      originalLayer.pm._fireEdit();
    });
    this._editedLayers = [];

    // disable drawing
    this.disable();
    if (this.options.continueDrawing) {
      this.enable();
    }
  },
  cut(layer) {
    const all = this._map._layers;
    const _latlngInfos = layer._latlngInfos || [];

    const layers = Object.keys(all)
      .map((l) => all[l])
      .filter((l) => l.pm)
      .filter((l) => !l._pmTempLayer)
      .filter(
        (l) =>
          (!L.PM.optIn && !l.options.pmIgnore) ||
          (L.PM.optIn && l.options.pmIgnore === false)
      )
      .filter((l) => l instanceof L.Polyline)
      .filter((l) => l !== layer)
      .filter((l) => l.pm.options.allowCutting)
      .filter((l) => {
        if (
          this.options.layersToCut &&
          L.Util.isArray(this.options.layersToCut) &&
          this.options.layersToCut.length > 0
        ) {
          return this.options.layersToCut.indexOf(l) > -1;
        }
        return true;
      })
      .filter((l) => !this._layerGroup.hasLayer(l))
      .filter((l) => {
        try {
          const lineIntersectFeatures = lineIntersect(
            layer.toGeoJSON(15),
            l.toGeoJSON(15)
          ).features;
          const lineInter = lineIntersectFeatures.length > 0;

          if (
            lineInter ||
            (l instanceof L.Polyline && !(l instanceof L.Polygon))
          ) {
            return lineInter;
          }
          return !!intersect(layer.toGeoJSON(15), l.toGeoJSON(15));
        } catch (e) {
          if (l instanceof L.Polygon) {
            console.error("You can't cut polygons with self-intersections");
          }
          return false;
        }
      });

    layers.forEach((l) => {
      let newLayer;
      if (l instanceof L.Polygon) {
        newLayer = L.polygon(l.getLatLngs());
        const coords = newLayer.getLatLngs();

        _latlngInfos.forEach((info) => {
          if (info && info.snapInfo) {
            const { latlng } = info;
            const closest = this._calcClosestLayer(latlng, [newLayer]);
            if (
              closest &&
              closest.segment &&
              closest.distance < this.options.snapDistance
            ) {
              const { segment } = closest;
              if (segment && segment.length === 2) {
                const { indexPath, parentPath, newIndex } =
                  L.PM.Utils._getIndexFromSegment(coords, segment);
                const coordsRing =
                  indexPath.length > 1 ? get(coords, parentPath) : coords;
                coordsRing.splice(newIndex, 0, latlng);
              }
            }
          }
        });
      } else {
        newLayer = l;
      }

      const diff = union(layer.toGeoJSON(15), newLayer.toGeoJSON(15));

      let resultLayer = L.geoJSON(diff, l.options);
      if (resultLayer.getLayers().length === 1) {
        [resultLayer] = resultLayer.getLayers();
      }
      this._setPane(resultLayer, 'layerPane');
      const resultingLayer = resultLayer.addTo(
        this._map.pm._getContainingLayer()
      );
      resultingLayer.pm.enable(l.pm.options);
      resultingLayer.pm.disable();

      l._pmTempLayer = true;
      layer._pmTempLayer = true;

      l.remove();
      l.removeFrom(this._map.pm._getContainingLayer());
      layer.remove();
      layer.remove();
      layer.removeFrom(this._map.pm._getContainingLayer());

      // Remove it only if it is a layergroup. It can be only not a layergroup if a layer exists
      if (resultingLayer.getLayers && resultingLayer.getLayers().length === 0) {
        this._map.pm.removeLayer({ target: resultingLayer });
      }

      if (resultingLayer instanceof L.LayerGroup) {
        resultingLayer.eachLayer((_layer) => {
          this._addDrawnLayerProp(_layer);
        });
        this._addDrawnLayerProp(resultingLayer);
      } else {
        this._addDrawnLayerProp(resultingLayer);
      }

      if (
        this.options.layersToCut &&
        L.Util.isArray(this.options.layersToCut) &&
        this.options.layersToCut.length > 0
      ) {
        const idx = this.options.layersToCut.indexOf(l);
        if (idx > -1) {
          this.options.layersToCut.splice(idx, 1);
        }
      }

      this._editedLayers.push({
        layer: resultingLayer,
        originalLayer: l,
      });
    });
  },
  _cutLayer(layer, l) {
    const fg = L.geoJSON();
    let diff;
    // cut
    if (l instanceof L.Polygon) {
      // find layer difference
      diff = difference(l.toGeoJSON(15), layer.toGeoJSON(15));
    } else {
      const features = flattenPolyline(l);

      features.forEach((feature) => {
        // get splitted line to look which line part is coverd by the cut polygon
        const lineDiff = lineSplit(feature, layer.toGeoJSON(15));

        let group;
        if (lineDiff && lineDiff.features.length > 0) {
          group = L.geoJSON(lineDiff);
        } else {
          group = L.geoJSON(feature);
        }

        group.getLayers().forEach((lay) => {
          // add only parts to the map, they are not covered by the cut polygon
          if (!booleanContains(layer.toGeoJSON(15), lay.toGeoJSON(15))) {
            lay.addTo(fg);
          }
        });
      });

      if (features.length > 1) {
        diff = groupToMultiLineString(fg);
      } else {
        diff = fg.toGeoJSON(15);
      }
    }
    return diff;
  },
  _change: L.Util.falseFn,
});
