import React from 'react';
import MaterialTable from 'material-table';
import Button from '@material-ui/core/Button';




function Editable() {
  const { useState } = React;


  let count = 1

  const [columns, setColumns] = useState([
    { title: 'Position', field: 'position', initialEditValue: (count +1)},
    { title: 'Artikelnummer', field: 'articleNr' },
    { title: 'Farbcode', field: 'colorcode' },
    { title: 'Motivnummer', field: 'motivNr' },
    { title: 'Anzahl', field: 'quantity', type: 'numeric' },
    {
      title: 'Stock or Sale?',
      field: 'toStock',
      lookup: { 0: 'for Stock', 1: 'for Sale' },
    },
  ]);

  const [data, setData] = useState([
    { position: '1', articleNr: '1234567', colorcode: '#123456', motivNr: '86', quantity: '2', toStock: '0' },
   
  ]);

  function createOrder() {
    alert('test');
  }

 

  return (
  
    <>
    
    <MaterialTable
      title="Bestellung anlegen"
      columns={columns}
      data={data}
      editable={{
        onRowAdd: newData =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              setData([...data, newData]);
              console.log(newData);
              
              //count= count+1;  irgendwo muss count für die Position hochgezählt werden
              resolve();
            }, 1000)
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              const dataUpdate = [...data];
              const index = oldData.tableData.id;
              dataUpdate[index] = newData;
              setData([...dataUpdate]);
              
              resolve();
            }, 1000)
          }),
        onRowDelete: oldData =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              const dataDelete = [...data];
              const index = oldData.tableData.id;
              dataDelete.splice(index, 1);
              setData([...dataDelete]);
             
              resolve()
            }, 1000)
          }),
         
      }}

     

    /> 
    
    <Button onClick={createOrder} style={{float: 'right', margin:'5px'}} variant="contained" color="primary">
          Bestellung anlegen
          </Button>
   </>
  )
}




export default Editable; 




