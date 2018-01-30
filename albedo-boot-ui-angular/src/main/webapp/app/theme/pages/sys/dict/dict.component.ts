import { AfterViewInit, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ScriptLoaderService } from "../../../../shared/base/service/script-loader.service";
import { CTX, DATA_STATUS } from "../../../../app.constants";
import { ActivatedRoute } from "@angular/router";
import { Principal } from "../../../../auth/_services/principal.service";
import {SessionStorageService} from "ngx-webstorage";

declare let datatable: any;
@Component({
    selector: ".sys-dict-list.page-list",
    templateUrl: "./dict.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class DictComponent implements OnInit, OnDestroy, AfterViewInit {


    ctx: any;
    routerSub: any;
    nodeId: any;
    constructor(private _script: ScriptLoaderService,
                private sessionStorage: SessionStorageService,
        private principal: Principal,
        private router: ActivatedRoute) {
        this.ctx = CTX;
        this.nodeId = sessionStorage.retrieve("tree_dict_select_node_id"), this.nodeId = (this.nodeId) ? this.nodeId : 1;
    }



    ngOnInit() {
        this.routerSub = this.router.url.subscribe((urlSegment) => {
            // console.log(urlSegment)
        });
    }

    ngOnDestroy() {
        this.routerSub.unsubscribe();
    }

    ngAfterViewInit() {
        // this._script.load('.sys-dict-list',
        //     'assets/demo/default/custom/components/datatables/base/data-ajax.js');
        this.initTable()
        // Helpers.setBreadcrumbs();
    }

    initTable() {
        var thisPrincipal = this.principal;
        var options = {
            data: {
                source: {
                    read: {
                        // sample GET method
                        method: 'GET',
                        url: CTX + '/sys/dict/',
                    },
                },
                pageSize: 10,
            },
            // columns definition
            columns: [
                {
                    field: 'name',
                    title: '名称',
                    sortable: 'asc',
                }, {
                    field: 'code',
                    title: '编码',
                }, {
                    field: 'key',
                    title: '键',
                }, {
                    field: 'val',
                    title: '值',
                }, {
                    field: 'isShow',
                    title: '是否显示',
                }, {
                    field: 'sort',
                    title: '序号',
                    sortable: 'asc'
                }, {
                    field: 'status',
                    title: '状态',
                    // callback function support for column rendering
                    template: function(row) {
                        return '<span class="m-badge ' + DATA_STATUS[row.status].class + ' m-badge--wide">' + row.status + '</span>';
                    },
                }, {
                    field: 'lastModifiedDate',
                    title: '修改时间',
                }, {
                    field: 'Actions',
                    width: 110,
                    title: '操作',
                    sortable: false,
                    overflow: 'visible',
                    template: function(row) {
                        return '\
						<a href="#/sys/dict/form/'+ row.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="编辑">\
							<i class="la la-edit"></i>\
						</a>\
						<a href="javascript:void(0)" class="m-portlet__nav-link btn m-btn m-btn--hover-warning m-btn--icon m-btn--icon-only m-btn--pill confirm" title="'+ (row.status == "正常" ? "锁定" : "解锁") + '字典"\
						 data-table-id="#data-table-dict" data-method="put"  data-title="你确认要操作【'+ row.name + '】字典吗？" data-url="' + CTX + '/sys/dict/' + row.id + '">\
							<i class="la la-'+ (row.status == "正常" ? "unlock-alt" : "unlock") + '"></i>\
						</a>\
					    <a href="javascript:void(0)" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill confirm" title="删除"\
                             data-table-id="#data-table-dict" data-method="delete"  data-title="你确认要删除【'+ row.name + '】字典吗？" data-url="' + CTX + '/sys/dict/' + row.id + '">\
                            <i class="la la-trash"></i>\
                        </a>';
                    },
                }],
        };

        albedoList.initTable($('#data-table-dict'), $('#dict-search-form'), options);
        albedoList.init();
        albedoForm.initTree();
    }

    cancelClickNodeDict(event, treeId, treeNode) {
        // console.log(event)
        albedo.getSessionStorage().store("tree_dict_select_node_id", '');
        $("#parentId").val('');
        $(".filter-submit-table-dict").trigger("click");
    }
    clickTreeNodeDict(event, treeId, treeNode) {
        // console.log(event)
        var addUrl = $("#add-dict").attr("data-url-temp");
        if (addUrl) $("#add-dict").attr("data-url", addUrl + (addUrl.indexOf("?") == -1 ? "?" : "&") + "parentId=" + treeNode.id);
        this.nodeId = treeNode.id;
        albedo.getSessionStorage().store("tree_dict_select_node_id", this.nodeId);
        $("#parentId").val(treeNode.id);
        $(".filter-submit-table-dict").trigger("click");
    }

}
