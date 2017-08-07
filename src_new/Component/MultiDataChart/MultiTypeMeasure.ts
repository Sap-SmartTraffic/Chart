import { BaseMeasure, IBaseMeasure } from '../../Core/BaseMeasure';
import { IGetDomain } from './MultiDataChart';
import _ = require('lodash');
export interface IMultiDataMeasure extends IBaseMeasure,IGetDomain{}

export class MultiDataMeasure extends BaseMeasure implements IMultiDataMeasure{
    max(k?:string){
        return _.max(_.map(this.data,k))
    }
    min(k?:string){
        return _.min(_.map(this.data,k))
    }
    getDomain(k?){
        return [this.min(k),this.max(k)]
    }
}