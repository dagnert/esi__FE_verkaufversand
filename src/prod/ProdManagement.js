import React, { Component } from 'react'
import '../App.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import ProdAppBar from '../components/ProdAppBar';
import MaterialTable from "material-table";
import { FormControl } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import FooterPage from '../components/Footer';
import axios from 'axios'

import Icon from '@material-ui/core/Icon';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

var emptyStatus = {
    prodOrderNum: '',
    endDate: '',
    colorHEX: '',
    ProdSortNum: '',
    prodStatus: '',
    selectProdStatus: '',
    quantity: '',
    deltaE: '',
    orderNumber: '',
    lineItem: '',
}

class ProdManagement extends Component {
    constructor(props) {
        super(props)

        this.state = {
            prodOrderNum: '', //Nummer
            statusID: '3', //ID des Kunden
            statusdescription: 'Produktion abgeschlossen', //String mit Beschreibung
            data: null,
            selectProdStatus: 'planned',
            prodStatus: [],
            tableRef: '',
            data: '',
            setData: '',
            userInput: false,
        }

        this.submitHandlerGetStatus()
    }

    changeHandler = e => {
        this.setState({ [e.target.name]: e.target.value })
        console.log([e.target.name] + " + " + e.target.value)
    }

    submitHandler = async (e) => {
        console.log(this.state)
        this.setState(
            { newProd: true }
        )

        console.log("Sie haben diesen Auftrag erfolgreich als abgeschlossen aktualisiert: " + e)

        await axios
            .post(process.env.REACT_APP_AMAZON_API_BASE+'/updateprodstatus', { "prodOrderNum": e })
            .then((res) => {
                console.log(res.data)
                var data = JSON.stringify(res.data)
                data = JSON.parse(data)
                data = data.body.status
                return data
            })
            .then(data => {
                console.log("data: " + data)
                this.setState({ data: data })

                this.confirmationPopup(data)
            })
            .catch(error => {
                console.log(error)
            })

        this.submitHandlerGetStatus()
    }

    submitHandlerGetStatus = e => {
        if (typeof e != 'undefined') {
            e.preventDefault();
        }
        console.log(this.state)
        this.setState(
            { newProd: true }
        )

        var orderStatus = this.state.selectProdStatus

        if (orderStatus == 'open' || orderStatus == 'planned' || orderStatus == 'produced') {
            axios
                .post(process.env.REACT_APP_AMAZON_API_BASE+'/readorderinfo', { "orderStatus": orderStatus })
                .then((res) => {
                    var data = JSON.stringify(res.data)
                    data = JSON.parse(data)
                    data = data.body
                    console.log(data)
                    return data
                })
                .then(data => {
                    console.log("data: " + data)
                    this.setState({ prodStatus: data })
                })
                .catch(error => {
                    console.log(error)
                })
        } else {
            axios
                .get(process.env.REACT_APP_AMAZON_API_BASE+'/readorderinfo')
                .then((res) => {
                    var data = JSON.stringify(res.data)
                    data = JSON.parse(data)
                    data = data.body
                    console.log(data)
                    return data
                })
                .then(data => {
                    console.log("data: " + data)
                    this.setState({ prodStatus: data })
                })
                .catch(error => {
                    console.log(error)
                })
        }

    }

    /** Added Popup to confirm if status shall be updated. If yes, calls POST */
    submitPopup = (rowData) => {
        confirmAlert({
            title: "Auftragsstatus aktualisieren",
            message: "Sind Sie sicher, dass Sie den Auftragsstatus auf 'produziert' ändern möchten?",
            buttons: [
                {
                    label: 'Ja',
                    onClick: async () => {
                        console.log("User pressed yes");
                        await this.submitHandler(rowData.prodOrderNum)
                    }
                },
                {
                    label: 'Abbrechen',
                    onClick: () => {
                    }
                }
            ]
        })
        console.log(this.state.userInput)
    };

    /** Added Popup to confirm if status shall be updated. If yes, calls POST */
    confirmationPopup = (status) => {
        confirmAlert({
            title: "Auftragsstatus aktualisieren",
            message: status,
            buttons: [
                {
                    label: 'Zur Kenntniss genommen',
                    onClick: () => {
                    }
                },
            ]
        })
        console.log(this.state.userInput)
    };

    setnewProd(event) {
        console.log(event.target.value)
    }

    render() {
        const {
            prodOrderNum,
            endDate,
            colorHEX,
            ProdSortNum,
            prodStatus,
            quantity,
            deltaE,
            orderNumber,
            lineItem,
        } = this.state;
        let content = '';
        return (
            <>
                <div>
                    <div><ProdAppBar /></div>

                    <form onSubmit={this.submitHandlerGetStatus}>

                        <div style={{ padding: '20px', paddingLeft: '30px' }} ><h2>Produktionsstatus der anstehenden Aufträge einsehen und Status auf "produziert" aktualisieren </h2>



                            <div style={{ width: '100%', padding: '20px' }}>
                                <h3>Hier finden Sie eine Schritt für Schritt Anleitung, wie Sie einen produzierten Auftrag im System aktualisieren:</h3>
                                <ol role="listitem" class="item">
                                    <li value="-" role="listitem" class="">Wenn eine Bestellung fertig produziert ist, dann klicken Sie oberhalb auf "Produktionsstatus abfragen" und anschließend über das Suchfeld rechts <Icon>search</Icon> den entsprechenden Auftrag mittels der Prod-Order-Nummer. Diese Nummer finden Sie auf dem Etikett der T-Shirts aufgedruckt.</li>
                                    <li value="-" role="listitem" class="">Klicken Sie anschließend in der entsprechenden Zeile links auf das Aktualisierungssymbol: <Icon>update</Icon></li>
                                    <li value="-" role="listitem" class="">Bestätigen Sie dann das sich öffnende Pop-up Fenster. Hierdurch werden der Status der Bestellung bei V&V aktualisiert und die Materialwirtschaft benachrichtigt, um die Order abzuholen.</li>
                                    <li value="-" role="listitem" class="">Sie erhalten nachfolgend eine Bestätigung der Datenbank, ob die Aktualisierung erfolgreich war.</li>
                                </ol>

                            </div>

                            <div style={{ width: '1200px', padding: '0px', paddingLeft: '20px' }}>
                                <FormControl>
                                    <Grid container
                                        direction="row"
                                        justify="center"
                                        alignItems="flex-start">

                                        <Grid
                                            container spacing={3}>
                                            <Grid item xs={6} sm={6}>
                                                <div onChange={this.changeHandler}> Filtern Sie nach dem Produktionsstatus: <br /><br />
                                                    <input type="radio" value={""} name="selectProdStatus" /> Alle anzeigen <br />
                                                    <input type="radio" value={"open"} name="selectProdStatus" /> Offene Aufträge <br />
                                                    <input type="radio" value={"planned"} defaultChecked name="selectProdStatus" /> Eingeplante Aufträge <br />
                                                    <input type="radio" value={"produced"} name="selectProdStatus" /> Abgeschlossene Aufträge <br />
                                                </div>
                                            </Grid>
                                            <Grid item xs={6} sm={6}> <br />
                                                <Button type="submit" style={{ float: 'left', margin: '20px' }} color="primary" variant="contained"
                                                    title="Wenn Sie alle Aufträge in der Datenbank einsehen möchten dann klicken Sie bitte hier. Über die Auswahl Links können Sie sich gezielt Aufträge nach dem Produktionsstatus anzeigen lassen."
                                                >Produktionsstatus abfragen</Button>
                                            </Grid>
                                        </Grid >
                                    </Grid>
                                </FormControl>

                                <h3>
                                    Bestätigung: {content = this.state.data}
                                </h3>
                            </div>
                        </div>


                    </form>

                    <div style={{ maxWidth: "100%" }}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                margin: "0px",
                            }}
                        ></div>
                        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"></link>
                        <div style={{ paddingTop: "5px" }}>
                            <MaterialTable
                                style={{ marginLeft: "20px", marginRight: "20px" }}
                                title="Produktionsstatus der Aufträge"
                                columns={[
                                    { title: "Production Order Nr", field: "prodOrderNum" },
                                    { title: "Order Nr", field: "orderNumber" },
                                    { title: "Line Item", field: "lineItem" },
                                    { title: "Artikel Nr", field: "articleNumber" },
                                    { title: "End Date", field: "endDate" },
                                    { title: "HEX color", field: "colorHEX" },
                                    {
                                        title: "Farbcode",
                                        field: "colorCode",
                                        tooltip: "HEX-Code: #282C34",
                                        maxwidth: '10px',
                                        cellStyle: (input, rowData) => {
                                          return {
                                            backgroundColor: rowData?.colorHEX || input,
                                          };
                                        },
                                      },
                                    { title: "Prod Status", field: "prodStatus" },
                                    { title: "Anzahl", field: "quantity" },
                                    { title: "Delta E", field: "deltaE" },
                                ]}

                                data={this.state.prodStatus}
                                options={{
                                    headerStyle: {
                                        backgroundColor: "#3f51b5",
                                        color: "#FFFF",
                                    },
                                }}

                                actions={[
                                    rowData => ({
                                        icon: 'update',
                                        tooltip: 'Produktion abschließen',
                                        onClick: (event, rowData) => this.submitPopup(rowData),
                                        disabled: rowData.prodStatus == 'open' || rowData.prodStatus == 'produced'
                                    }),
                                    {
                                        icon: "done_all",
                                        tooltip: "Refresh",
                                        isFreeAction: true,
                                        onClick: (e) =>
                                            this.submitHandlerGetStatus(e),
                                    },

                                ]}
                            />
                        </div>
                    </div>
                </div>
                <FooterPage />
            </>
        );
    }
}

export default ProdManagement; 