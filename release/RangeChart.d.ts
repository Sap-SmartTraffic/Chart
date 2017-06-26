declare module "Core/Measure" {
    export class Measure {
        id: string;
        data: any;
        style: any;
        type: string;
        constructor(id?: any, data?: any, type?: any, style?: any);
    }
}
declare module "Core/Evented" {
    export interface IEvented {
        on: (t: string, fn: Function, ctx?: object) => this;
        off: (t: string, fn: Function) => this;
        fire: (t: string, obj?: any) => this;
        listen: (o: IEvented, estr: string, fn: Function) => this;
    }
    export class Evented implements IEvented {
        constructor();
        private events;
        private parent;
        on(t: string, fn: Function, ctx?: Object): this;
        private _on(t, fn, ctx?);
        private _off(t, fn?, ctx?);
        off(t: string, fn: Function): this;
        fire(t: string, obj?: any): this;
        listen(o: IEvented, estr: string, fn: Function): this;
        listenTo(e: Evented): this;
        clear(): void;
    }
}
declare module "Core/Util" {
    export = Util;
    module Util {
        function isEndWith(s: any, ed: string): boolean;
        function toPixel(s: string | number, ctx?: string): any;
        function isBeginWith(s: any, bs: string): boolean;
        function isContaint(s: any, ss: any): boolean;
        function max(nums: any[], key?: any): number;
        function min(ns: any[], key?: any): number;
        let d3Invoke: (...args: any[]) => any;
        function getStringRect(str: string, cla?: string, font_size?: number): {
            width: number;
            height: number;
        };
        function CacheAble(fn: any, keyFn?: any): () => any;
        function curry(f: Function): (...args: any[]) => any;
        function deepExtend(des: any, ...source: any[]): any;
        function enableAutoResize(dom: any, fn: any): void;
    }
}
declare module "Core/View" {
    import d3 = require("d3");
    import { Evented } from "Core/Evented";
    export class View extends Evented {
        constructor(...confs: any[]);
        defaultConfig(): IViewConfig;
        config: IViewConfig;
        el: Element;
        elD3: d3.Selection<Element, {}, null, null>;
        initView(): this;
        appendTo(dom: d3.Selection<Element, {}, null, null>): this;
        style(s: any): this;
        attr(a: any): this;
        render(ctx?: any): this;
        addClass(c: any): this;
        removeClass(c: any): this;
    }
    export interface IViewConfig {
        tagName: string | null | undefined;
        className: string | null | undefined;
        style: {} | undefined | null;
    }
}
declare module "Core/BaseLayer" {
    import { BaseChart } from "Core/BaseChart";
    import { View, IViewConfig } from "Core/View";
    export class BaseLayer extends View {
        constructor(id?: any, ...confs: any[]);
        defaultConfig(): ILayerConfig;
        id: string;
        rendered: boolean;
        chart: BaseChart;
        config: ILayerConfig;
        setConfig(c: any): this;
        addTo(c: BaseChart): this;
        render(): this;
        renderAt(dom: Element | HTMLElement | SVGAElement): void;
        clear(): void;
    }
    export interface ILayerConfig extends IViewConfig {
        className: string;
        tagName: string;
        style: {
            top: string | undefined | null;
            right: string | undefined | null;
            bottom: string | undefined | null;
            left: string | undefined | null;
            width: string;
            height: string;
            "z-index": number;
            position: string;
        };
    }
}
declare module "Core/BaseChart" {
    import { Evented } from "Core/Evented";
    import { BaseLayer } from "Core/BaseLayer";
    import { Measure } from "Core/Measure";
    import { View } from "Core/View";
    export class BaseChart extends Evented {
        measures: Measure[];
        layers: BaseLayer[];
        rootView: View;
        config: IChartConfig;
        constructor(...conf: any[]);
        addClass(c: any): this;
        removeClass(c: any): this;
        defaultConfig(): IChartConfig;
        renderAt(dom: Element | HTMLElement | SVGAElement | string): void;
        redraw(): void;
        loadMeasures(measures: any[]): void;
        addMeasure(m: Measure): void;
        getMeasure(t: string): Measure[];
        addLayer(l: BaseLayer): this;
        getFirstMeasure(type: string): Measure;
        removeLayer(id: any): this;
        _clearLayer(l: BaseLayer): this;
        stringRectCache: any;
        getStringRect(s: any, cls?: any, fontSize?: any): {
            width: any;
            height: any;
        };
        getColor(color?: any): any;
        render(): void;
    }
    export interface IChartConfig {
        className: string;
        style: {
            width: string;
            height: string;
        };
    }
}
declare module "Layer/TitleLayer" {
    import { BaseLayer, ILayerConfig } from "Core/BaseLayer";
    export class TitleLayer extends BaseLayer {
        defaultConfig(): ITitleLayerConfig;
        config: ITitleLayerConfig;
        setTitle(t: any): void;
        render(): this;
    }
    export interface ITitleLayerConfig extends ILayerConfig {
        value: string;
    }
}
declare module "Layer/RangeLayer" {
    import d3 = require("d3");
    import { BaseLayer, ILayerConfig } from "Core/BaseLayer";
    export class RangeLayer extends BaseLayer {
        config: RangeLayerConfig;
        defaultConfig(): RangeLayerConfig;
        drawer(svgNode: d3.Selection<Element, {}, null, null>): void;
        render(): this;
    }
    export interface RangeLayerConfig extends ILayerConfig {
        padding: {
            top: string | undefined | null;
            right: string | undefined | null;
            bottom: string | undefined | null;
            left: string | undefined | null;
        };
    }
}
declare module "Layer/FocusPanel" {
    import d3 = require("d3");
    import { BaseLayer, ILayerConfig } from "Core/BaseLayer";
    export class FocusPanel extends BaseLayer {
        config: FocusPanelConfig;
        defaultConfig(): FocusPanelConfig;
        drawer(svgNode: d3.Selection<Element, {}, null, null>): void;
        render(): this;
    }
    export interface FocusPanelConfig extends ILayerConfig {
        rangeMin: string;
        rangeMax: string;
        focusTime: string;
        padding: number;
    }
}
declare module "Chart/RangeChart/RangeChart" {
    import { BaseChart } from "Core/BaseChart";
    import { RangeLayer } from "Layer/RangeLayer";
    import { FocusPanel } from "Layer/FocusPanel";
    export class RangeChart extends BaseChart {
        rangeLayer: RangeLayer;
        focusPanel: FocusPanel;
        constructor(conf?: any);
        data(data: any[]): this;
    }
}
