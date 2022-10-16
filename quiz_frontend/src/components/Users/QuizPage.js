import { Button, Modal, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState, useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { useNavigate } from 'react-router-dom';
import useStateContext from '../../hooks/useStateContext';
import { createAPIEndpoint, Endpoints } from '../api';

export default function QuizPage() {
  const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentRows, setCurrentRows] = useState(10);
  const [currentSort, setCurrentSort] = useState("Name|asc");
  const [reloadBool, setReloadBool] = useState(true);
  const {context} = useStateContext();
  const [open, setOpen] = React.useState(false);
  const [editId, setEditId] = useState(0);
  const [modalValue, setModalValue] = useState('');
  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setEditId(0);
    setModalValue('');
    setOpen(false);
  };
  const columns = [
    {
      name: 'Name',
      selector: 'name',
      sortable: true,
    },
    {
      name: 'Quiz Code',
      selector: 'quizCode',
      sortable: true
      //right: true,
    },
    {
      cell:(row) => <Button onClick={goToQuestions} id={row.id} color="success" variant='contained' size='small' sx={{fontSize:'10px'}}>Questions</Button>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      cell:(row) => <Button onClick={handleEditQuiz} id={row.id} color="warning" variant='contained' size='small' sx={{fontSize:'10px'}}>Edit</Button>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      cell:(row) => <Button onClick={deleteQuiz} id={row.id} color="error" variant='contained' size='small' sx={{fontSize:'10px'}}>Delete</Button>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    }
  ];
  const goToQuestions = (state) => {
    navigate('/questions',{state : {quizId : state.target.id}});
  };

  const handleEditQuiz = (state) => {
    createAPIEndpoint(Endpoints.quizs)
    .fetchById(state.target.id)
    .then((res)=>{
      setModalValue(res.data.name);
      setEditId(state.target.id);
      setOpen(true);
    })
    .catch((err)=>{console.log(err)});
  };

  const deleteQuiz = (state) => {
    createAPIEndpoint(Endpoints.quizs)
    .delete(state.target.id)
    .then((res)=>{
      setReloadBool(!reloadBool);
    })
    .catch((err)=>{console.log(err)});
  };

  useEffect(() => {
    createAPIEndpoint(Endpoints.quizs + "/List").fetchPagination(
      {
        isPagination : true,
        quizCreatorId : context.userId,
        size : currentRows,
        offset : currentPage,
        sort : currentSort
      }
    )
    .then((res)=>{
      console.log(res);
      setData(res.data.items);
      setTotalRows(res.data.totalRows);
    })
    .catch((err)=>{console.log(err);});
  }, [currentRows, currentPage, currentSort, reloadBool]);
  
  const handleSort = (sortColumn, sortDirection)=>{
    //setData([{id:2, name:'Quiz_2', quizCode:5234}]);
    console.log(sortColumn);
    setCurrentSort(sortColumn.name+"|"+sortDirection);
  };

  const handleChangeRowsPerPage = (size)=>{
    setCurrentRows(size);
    console.log(size);
  }

  const handleChangePage = (offset)=>{
    setCurrentPage(offset);
    console.log(offset);
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const addQuiz = ()=>{
    var valueName = document.getElementById("quizName").value;
    if(valueName=="")
      return;
    
    createAPIEndpoint(Endpoints.quizs).post({
      Name: valueName,
      QuizCreatorId: context.userId
    }).then((res)=>{
      //document.getElementById("quizName").value = "";
      handleChangePage(currentPage);
      handleClose();
      setReloadBool(!reloadBool);
    })
    .catch((err)=>{
      console.log(err);
    });
  }

  const editQuiz = (qId)=>{
    var valueName = document.getElementById("quizName").value;
    if(valueName=="")
      return;
    createAPIEndpoint(Endpoints.quizs).put(qId,{
      Id: qId,
      Name: valueName
    }).then((res)=>{
      //document.getElementById("quizName").value = "";
      handleChangePage(currentPage);
      handleClose();
      setReloadBool(!reloadBool);
    })
    .catch((err)=>{
      console.log(err);
    });
  }

  const handleModalSubmit = ()=>{
    if(editId>0)
      editQuiz(editId);  
    else
      addQuiz();
  }

  return (
    <>
    <div style={{width:"80%", margin:"auto", marginTop:"30px"}}>
      <Button onClick={handleOpen} variant='contained'>
        Create Quiz
      </Button>
    </div>
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {editId>0 ? 'Edit Quiz' : 'New Quiz'}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <TextField 
                  variant='outlined' 
                  size='small'
                  label='Quiz Name'
                  name='quizName' 
                  id='quizName'
                  sx={{m:1}}
                  defaultValue={modalValue}
                  required
              />
              <Button
                  //type='submit'
                  variant='contained'
                  sx={{width:'85%', m:1}}
                  onClick={handleModalSubmit}
              >
                  Submit
              </Button>
          
        </Typography>
      </Box>
    </Modal>
    <div style={{width:"80%", margin:'auto', marginTop:'30px'}}>
      <DataTable
          title="Quiz List"
          columns={columns}
          data={data}
          //selectableRows // add for checkbox selection
          onSort={handleSort}
          pagination
          paginationTotalRows={totalRows}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          onChangePage={handleChangePage}
          paginationServer
        />
    </div>
    </>
  )
}
