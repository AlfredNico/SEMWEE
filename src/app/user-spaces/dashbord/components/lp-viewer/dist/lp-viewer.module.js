"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.LpViewerModule = void 0;
var updates_header_component_1 = require("./viwer-read-import/updates-header.component");
var core_1 = require("@angular/core");
var ngx_perfect_scrollbar_1 = require("ngx-perfect-scrollbar");
var router_1 = require("@angular/router");
var lp_viewer_component_1 = require("./lp-viewer.component");
var viwer_import_component_1 = require("./viwer-import/viwer-import.component");
var viwer_read_import_component_1 = require("./viwer-read-import/viwer-read-import.component");
var lp_viwers_service_1 = require("../../services/lp-viwers.service");
var header_options_component_1 = require("./viwer-read-import/header-options.component");
var token_interceptor_1 = require("@app/token.interceptor");
var error_interceptor_1 = require("@app/error.interceptor");
var shared_components_module_1 = require("@app/shared/modules/shared-components.module");
var edit_component_1 = require("./editLpViewer/edit.component");
var undo_redo_component_1 = require("./UndoRedo/undo-redo.component");
var drag_dropp_directive_1 = require("../../directives/drag-dropp.directive");
var search_filter_replace_component_1 = require("./search_filter_replace/search-filter-replace.component");
var angular_resizable_element_1 = require("angular-resizable-element");
var LpViewerModule = /** @class */ (function () {
    function LpViewerModule() {
    }
    LpViewerModule = __decorate([
        core_1.NgModule({
            declarations: [
                lp_viewer_component_1.LpViewerComponent,
                viwer_import_component_1.ViwerImportComponent,
                viwer_read_import_component_1.ViwerReadImportComponent,
                header_options_component_1.HeaderOptionsComponent,
                updates_header_component_1.UpdatesHeaderComponent,
                edit_component_1.EditComponent,
                undo_redo_component_1.UndoRedoComponent,
                drag_dropp_directive_1.DragDroppDirective,
                search_filter_replace_component_1.SearchReplaceComponent,
            ],
            imports: [
                shared_components_module_1.SharedComponentsModule,
                ngx_perfect_scrollbar_1.PerfectScrollbarModule,
                angular_resizable_element_1.ResizableModule,
                router_1.RouterModule.forChild([{ path: '', component: lp_viewer_component_1.LpViewerComponent }]),
            ],
            exports: [router_1.RouterModule],
            entryComponents: [
                viwer_import_component_1.ViwerImportComponent,
                viwer_read_import_component_1.ViwerReadImportComponent,
                header_options_component_1.HeaderOptionsComponent,
                updates_header_component_1.UpdatesHeaderComponent,
            ],
            schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA, core_1.NO_ERRORS_SCHEMA],
            providers: [lp_viwers_service_1.LpViwersService, token_interceptor_1.tokenInterceptor, error_interceptor_1.errorInterceptor]
        })
    ], LpViewerModule);
    return LpViewerModule;
}());
exports.LpViewerModule = LpViewerModule;
