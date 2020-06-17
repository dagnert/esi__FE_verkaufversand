import React, { Component } from 'react'
import '../App.css';
import Button from '@material-ui/core/Button';
import ProdAppBar from '../components/ProdAppBar';
import { FormControl } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import FooterPage from '../components/Footer';
import axios from 'axios'


class OrderManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      name: this.props.filename ? this.props.filename : 'data',
      url: '',
      status: '',
    };
  }

  changeHandler = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  submitHandler = e => {
    var test = {
      "key1": "value1",
      "key2": "value2",
      "key3": "value3",
    };

    e.preventDefault()
    console.log(this.state)
    this.setState(
      {
        newProd: true,
      }
    )
    axios
      .post('https://2pkivl4tnh.execute-api.eu-central-1.amazonaws.com/prod/sortOrders', { crossdomain: true })
      .then((res) => {
        console.log(res.data)
        var data = JSON.stringify(res.data)
        data = JSON.parse(data)
        return data
      })
      .then(data => {
        this.setState({ url: data.body.url, status: data.body.status })
      })
      .catch(error => {
        console.log(error)
      })
  }

  setnewProd(event) {
    console.log(event.target.value)
  }

  render() {
    const { prodOrderNr } = this.state;
    let content = '';
    return (
      <>
        <div>
          <div><ProdAppBar /></div>

          <form onSubmit={this.submitHandler}>

            <div style={{ padding: '20px', paddingLeft: '30px' }} ><h2>CSV Datei erstellen und herunterladen </h2>

              <div style={{ width: '1200px', padding: '0px', paddingLeft: '10px' }}>
                <FormControl>
                  <Grid container
                    direction="row"
                    justify="center"
                    alignItems="flex-start">

                    <Grid
                      container spacing={3}>
                      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
                      <Grid item xs={6} sm={6}>
                        <Button type="submit" style={{ float: 'left', margin: '20px' }} color="primary" variant="contained"

                          title="Erstellen Sie eine CSV-Datei mit den Nächsten anstehenden Aufträgen bequem per Knopfdruck">
                          CSV-Datei erstellen</Button>
                      </Grid>
                      <Grid item xs={6} sm={6}>
                        <a href={this.state.url} target="_blank" rel="noopener noreferrer" download>
                          <Button style={{ float: 'left', margin: '20px', height: '65px' }} alt="Download CSV-Datei" color="primary" variant="contained" title="Nachdem Sie die CSV-Datei mit den nächsten Aufträgen erstellt haben können Sie sie hier herunterladen und abspeichern"
                            disabled={!this.state.url}>
                            <i className="fa fa-download" icon="download" />  </Button>
                        </a>

                      </Grid>
                    </Grid >
                  </Grid>

                </FormControl>

                <div>
                  Erstellen Sie eine CSV-Datei mit den offenen Aufträgen per Knopfdruck. Im Hintergrund werden dabei alle anstehenden Aufträge nach dem Enddatum und dem Delta-E Schema sortiert und exportiert. Nachdem Sie die CSV-Datei erstellt haben, können Sie sie mit einem Klick auf das Icon herunterladen und abspeichern.
                  <h3>Bestätigung: {content = this.state.status}</h3>
                </div>
              </div>

            </div>
          </form>

          <hr style={{
            color: "#3f51b5",
            backgroundColor: "#3f51b5",
            height: 2,
            borderColor: "#3f51b5"
          }} />

          <div style={{ padding: '20px' }} >
            <h2>Große Aufträge aufsplitten</h2>

            (In Arbeit) Hier können Sie in Zukunft manuell große Aufträge aufteilen und so einplanen, dass die Produktion bestmöglich ausgelastet ist.
          </div>
        </div>
        <FooterPage />
      </>
    );
  }
}

export default OrderManagement; 