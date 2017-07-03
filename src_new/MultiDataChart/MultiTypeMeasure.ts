import { BaseMeasure, IBaseMeasure } from '../Core/BaseMeasure';
import { IGetDomain } from './MultiDataChart';
import _ = require('underscore');
export interface IMultiDataMeasure extends IBaseMeasure,IGetDomain{}

export class MultiDataMeasure  extends BaseMeasure implements IMultiDataMeasure{
    max(k?){
        return _.max(_.pluck(this.data,k))
    }
    min(k?){
          return _.min(_.pluck(this.data,k))
    }
    getDomain(k?){
        return [this.min(k),this.max(k)]
    }
}