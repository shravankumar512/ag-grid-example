import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConnectivityErrorsModel, InitSCMACModalParam } from '../Models/SCMModels';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ModalServiceService } from '../SCMServices/modal-service.service';
import { Column, ColumnApi, RowNode } from 'ag-grid';
import { TextareaEditorComponent } from '../AgridEditor/textarea-editor/textarea-editor.component';
import { CheckboxRenderComponent } from '../AgridRender/checkbox-render/checkbox-render.component';
import { CheckboxEditorComponent } from '../AgridEditor/checkbox-editor/checkbox-editor.component';
import { ScmacrendererComponent } from '../AgridRender/scmacrenderer/scmacrenderer.component';

@Component({
    selector: 'app-hwe-dashboard',
    templateUrl: './hwe-dashboard.component.html',
    styleUrls: ['./hwe-dashboard.component.scss']
})
export class HweDashboardComponent implements OnInit, OnDestroy {


    public gridApi;
    public gridColumnApi;
    public columnDefs;
    public defaultColDef;
    public rowData: any;
    public i2cErrorRowData;
    public frameworkComponents;
    currentErrorTab: string = 'connectivity';
    HWETabForm: FormGroup;
    NDMIsHide: boolean;
    SAMIsHide: boolean;
    ACParams: InitSCMACModalParam;
    connectivityErrors: ConnectivityErrorsModel[] = [
        {
            ErrorType: 'Warning',
            RuleId: '5.0',
            Description: '',
            Severity: 'Minor',
            Valid_Error: 'No',
            FixedStatus: 'Yes',
            UpdatedBy: 'Li Cheng',
            Comments: {
                CommentsNum: 1,
                AttachNum: 1
            }

        },
        {
            ErrorType: 'Warning',
            RuleId: '5.0',
            Description: 'Can\'t find vcc Voltage of U58.7',
            Severity: 'Major',
            Valid_Error: 'Yes',
            FixedStatus: 'Yes',
            UpdatedBy: 'Li Cheng',
            Comments: {
                CommentsNum: 1,
                AttachNum: 1
            }
        },
        {
            ErrorType: 'Error',
            RuleId: '5.0',
            Description: 'Can\'t find vcc Voltage of U58.7',
            Severity: 'Minor',
            Valid_Error: 'No',
            FixedStatus: 'No',
            UpdatedBy: 'Li Cheng',
            Comments: {
                CommentsNum: 1,
                AttachNum: 1
            }
        },
        {
            ErrorType: 'Error',
            RuleId: '5.0',
            Description: 'Can\'t find vcc Voltage of U58.7',
            Severity: 'Potential',
            Valid_Error: 'Yes',
            FixedStatus: 'Yes',
            UpdatedBy: 'Li Cheng',
            Comments: {
                CommentsNum: 1,
                AttachNum: 1
            }
        },
        {
            ErrorType: 'Error',
            RuleId: '5.0',
            Description: 'Can\'t find vcc Voltage of U58.7',
            Severity: 'Minor',
            Valid_Error: 'Yes',
            FixedStatus: 'No',
            UpdatedBy: 'Li Cheng',
            Comments: {
                CommentsNum: 1,
                AttachNum: 1
            }
        }];

    DCRDropRatio = [{
        Board: 'DENVERTON_DB',
        RefDes: 'A_L7',
        CPN: '24-100752-01(LQW2BAN22NG00)',
        Category: 'Coil Inductor',
        Derived_Net: 'FLTR_P1V05_CPUPLL',
        DCR: '0.07',
        Current: '0.677966',
        Voltage: '1.05',
        Vdrop: '0.0474576',
        Drop_Ratio: '4.52%',
        Valid_Error: 'Yes',
        FixedStatus: 'NO',
        Comments: '1'
    },
    {
        Board: 'DENVERTON_DB',
        RefDes: 'A_L7',
        CPN: '24-100752-01(LQW2BAN22NG00)',
        Category: 'Coil Inductor',
        Derived_Net: 'FLTR_P1V05_CPUPLL',
        DCR: '0.07',
        Current: '0.677966',
        Voltage: '1.05',
        Vdrop: '0.0474576',
        Drop_Ratio: '4.52%',
        Valid_Error: 'Yes',
        FixedStatus: 'NO',
        Comments: {
            CommentsNum: 1,
            AttachNum: 1
        },
    }];
    BypassCapacitors = [{
        Board: 'DENVERTON_D',
        RefDes: 'B	A_U1',
        CPN: '15 - 105949 - 01',
        MPN: 'HW8076502639302 SR388',
        PowerGroup: 'V1P05(FLTR_DIGI_P1V05_A)',
        Decoupling_Requirement: '16 * 10u 19* 1u',
        Bypass_Cap: 'A_C545(0.1uF) A_C546(0.1uF)',
        Ordering_Violation: '',
        Status: 'PASS',
        Comments: {
            CommentsNum: 1,
            AttachNum: 1
        }
    },

    {
        Board: 'DENVERTON_D',
        RefDes: 'B	A_U1',
        CPN: '15 - 105949 - 01',
        MPN: 'HW8076502639302 SR388',
        PowerGroup: 'V1P05(FLTR_DIGI_P1V05_A)',
        Decoupling_Requirement: '16 * 10u 19* 1u',
        Bypass_Cap: 'A_C545(0.1uF) A_C546(0.1uF)',
        Ordering_Violation: '',
        Status: 'Fail',
        Comments: {
            CommentsNum: 1,
            AttachNum: 1
        }
    },

    {
        Board: 'DENVERTON_D',
        RefDes: 'B	A_U1',
        CPN: '15 - 105949 - 01',
        MPN: 'HW8076502639302 SR388',
        PowerGroup: 'V1P05(FLTR_DIGI_P1V05_A)',
        Decoupling_Requirement: '16 * 10u 19* 1u',
        Bypass_Cap: 'A_C545(0.1uF) A_C546(0.1uF)',
        Ordering_Violation: '',
        Status: 'Warning',
        Comments: {
            CommentsNum: 1,
            AttachNum: 1
        }
    }
    ];
    RegulatorPowers = [{
        Board: 'DENVERTON_DB',
        Instance: 'U254',
        CPN: '15-104128-01',
        MPN: 'TDA21470 (DC>=1722)',
        Input_Voltage: '12',
        VOUT: '1.15 P1V_CPU_CORE',
        Load_Current_Limit: '70',
        Calculated_Load_Current: '11',
        Calculated_Load_Power: '12.65',
        Efficiency_at_25C: '95%',
        Calculated_Supply_Power: '13.3158',
        Connected_to_Unknown_I_cc_max_Device: ''
    }];


    I2CERRORS = [{
        ErrorType: 'Err',
        RuleId: '10.0(1)',
        Description: 'I2C bus\'s SCL line SRT_CPU_LEG_SMB_CLK doesn\'t have any pullup connection.',
        Severity: 'Major',
        Valid_Error: 'No',
        FixedStatus: 'Yes',
        UpdatedBy: 'Li Cheng',
        Comments: {
            CommentsNum: 1,
            AttachNum: 1
        }
    },
    {
        ErrorType: 'Err',
        RuleId: '10.0(1)',
        Description: 'I2C bus\'s SCL line SRT_CPU_LEG_SMB_CLK doesn\'t have any pullup connection.',
        Severity: 'Potential',
        Valid_Error: 'No',
        FixedStatus: 'Yes',
        UpdatedBy: 'MaBolla',
        Comments: {
            CommentsNum: 1,
            AttachNum: 1
        }
    }
    ];

    I2CBUSCALCULATIONS = [{
        I2CBUS: 'I2C_IOFPGA_DB_SCL',
        Instances: 'P3.C4 U1.6 ',
        Cin: '16',
        Ctrace: '3.50288',
        PullupResistor: 'R15',
        PullupResistance: '2000',
        VoltageNet: 'A3P3V ',
        Voltage: '3.3',
        RpMinStandardMode100KHz: '966.666667',
        RpMaxStandardMode100KHz: '60515.14099',
        StandardMode100KHz: 'PASS',
        RpMinFastMode400KHz: '966.666667',
        RpMaxFastMode400KHz: '18154.5423',
        FastMode400KHz: 'PASS',
        RpMinFastModePlus1000KHz: '145',
        RpMaxFastModePlus1000KHz: '7261.816919',
        FastModePlus1000KHz: 'PASS',
        Comment: ' ',
        UnknownDevices: 'P3.C4 ',
        Willbefixed: 'No',
        Comments: {
            CommentsNum: 1,
            AttachNum: 1
        }
    }];

    ShowACModal: boolean;
    NDComments: string;
    rowClassRules = {}

    constructor(public fb: FormBuilder, public showModalService: ModalServiceService) {

    }

    ngOnDestroy(): void {
        this.showModalService.ShowModalSubject.unsubscribe();
    }

    ngOnInit() {

        this.columnDefs = [
            {
                field: 'ErrorType',
                headerName: 'ErrorType'

            },
            {
                field: 'RuleId',
                headerName: 'RuleId'
            },
            {
                field: 'Description',
                headerName: 'Description',
                cellEditorFramework: TextareaEditorComponent,
                editable: true

            },
            {
                field: 'Severity',
                headerName: 'Severity',
                cellClass: function (params) {

                    switch (params.value) {
                        case 'Major':
                            return 'ag_showRed';
                        case 'Minor':
                            return 'ag_showOrange';
                        case 'Potential':
                            return 'ag_showBlue';
                    }
                },
                editable: function (params) {
                    if (params.data.ErrorType === 'Warning') {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            {
                field: 'Valid_Error',
                headerName: 'Valid_Error',

                cellRendererFramework: CheckboxRenderComponent
            },
            {
                field: 'FixedStatus',
                headerName: 'FixedStatus',
                cellRendererFramework: CheckboxRenderComponent

            },
            {
                field: 'UpdatedBy',
                headerName: 'UpdatedBy'
            },
            {
                field: 'Comments',
                headerName: 'Comments',
                cellRendererFramework: ScmacrendererComponent
            }

        ];
        this.defaultColDef = {
            editable: false,
            width: 200
        };

        this.rowClassRules = {
            "showRed": "data.Severity === 'Major'",
            "showOrange": "data.Severity === 'Minor'",
            "showBlue": "data.Severity === 'Potential'"
        };

        this.SAMIsHide = true;
        this.NDMIsHide = true;
        this.ShowACModal = false;
    }

    connectivityonGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.gridApi.refreshCells({ force: true });
        this.rowData = this.connectivityErrors;
        params.api.sizeColumnsToFit();
    }
    i2cErroronGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.gridApi.refreshCells({ force: true });
        this.i2cErrorRowData = this.I2CERRORS;
        params.api.sizeColumnsToFit();
    }


    onChangeOfErrorTab(ErrorName: string) {
        this.currentErrorTab = ErrorName;
    }


    HWEPCBSubmit() {
        console.log(this.HWETabForm);
    }


    closeNDModal() {
        this.NDMIsHide = true;
    }

    showNDModal() {
        this.NDMIsHide = false;
    }

    closeSApproveModal() {
        this.SAMIsHide = true;
    }

    HWESApprove() {
        this.SAMIsHide = true;
    }

    showSAModal() {
        this.SAMIsHide = false;
    }

    NotifyDFRE() {
        this.NDMIsHide = true;
    }

}

<ag-grid - angular
#agGrid
formControlName = "Test"
style = "width: 100%; height: 100%;"
id = "myGrid-connectivity"
class="ag-theme-balham"
style = "min-height: 200px"
[columnDefs] = "columnDefs"
[enterMovesDownAfterEdit] = "true"
[enterMovesDown] = "true"
[defaultColDef] = "defaultColDef"
[rowData] = "rowData"
[paginationAutoPageSize] = "true"
[pagination] = "true"
[enableCellChangeFlash] = "true"
[rowClassRules] = "rowClassRules"
    (gridReady) = "connectivityonGridReady($event)"
    > </ag-grid-angular>
