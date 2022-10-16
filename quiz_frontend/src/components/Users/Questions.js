import { useLocation } from 'react-router-dom';
import { Button, FormControl, FormControlLabel, FormLabel, Modal, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState, useEffect } from 'react'
import DataTable from 'react-data-table-component'
import { useNavigate } from 'react-router-dom';
import useStateContext from '../../hooks/useStateContext';
import { createAPIEndpoint, Endpoints } from '../api';

const freshModalValues = {
    qInWords : "",
    opt1 : "",
    opt2 : "",
    opt3 : "",
    opt4 : "",
    ans : 0
  };

export default function Questions() {
  const location = useLocation();
  const quizId = parseInt(location.state.quizId);
  const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentRows, setCurrentRows] = useState(10);
  const [reloadBool, setReloadBool] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [editId, setEditId] = useState(0);
  const [modalValues, setModalValues] = useState(freshModalValues);
  const [quizName, setQuizName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    createAPIEndpoint(Endpoints.quizs).fetchById(quizId).then((res)=>{setQuizName(res.data.name)});
  }, [])
  

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setEditId(0);
    setModalValues(freshModalValues);
    setOpen(false);
  };

  const optionsArr = ["A", "B", "C", "D"];

  const columns = [
    {
      name: 'Question',
      selector: 'questionInWords',
      sortable: false,
    },
    {
      name: 'Option A',
      selector: 'option1',
      sortable: false
    },
    {
        name: 'Option B',
        selector: 'option2',
        sortable: false
    },
    {
        name: 'Option C',
        selector: 'option3',
        sortable: false
    },
    {
        name: 'Option D',
        selector: 'option4',
        sortable: false
    },
    {
        name: 'Answer',
        selector: 'answer',
        cell:(row)=>optionsArr[row.answer],
        sortable: false
    },
    {
      cell:(row) => <Button onClick={handleEditQuestion} id={row.id} color="warning" variant='contained' size='small' sx={{fontSize:'10px'}}>Edit</Button>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      cell:(row) => <Button onClick={deleteQuestion} id={row.id} color="error" variant='contained' size='small' sx={{fontSize:'10px'}}>Delete</Button>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    }
  ];
  const goToQuestions = (state) => {
    navigate('/questions',{state : {quizId : state.target.id}});
  };

  const handleEditQuestion = (state) => {
    createAPIEndpoint(Endpoints.questions)
    .fetchById(state.target.id)
    .then((res)=>{
      setModalValues({
        qInWords : res.data.questionInWords,
        opt1 : res.data.option1,
        opt2 : res.data.option2,
        opt3 : res.data.option3,
        opt4 : res.data.option4,
        ans : res.data.answer
      });
      setEditId(state.target.id);
      setOpen(true);
    })
    .catch((err)=>{console.log(err)});
  };

  const deleteQuestion = (state) => {
    createAPIEndpoint(Endpoints.questions)
    .delete(state.target.id)
    .then((res)=>{
      setReloadBool(!reloadBool);
    })
    .catch((err)=>{console.log(err)});
  };

  useEffect(() => {
    createAPIEndpoint(Endpoints.questions + "/List").fetchPagination(
      {
        isPagination : true,
        quizId : quizId,
        size : currentRows,
        offset : currentPage
      }
    )
    .then((res)=>{
      console.log(res);
      setData(res.data.items);
      setTotalRows(res.data.totalRows);
    })
    .catch((err)=>{console.log(err);});
  }, [currentRows, currentPage, reloadBool]);
  
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
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const addQuiz = ()=>{
    let radios = document.getElementsByName("row-radio-buttons-group");
    let inputVals = {
        questionInWords : document.getElementById('question').value,
        option1 : document.getElementById('option1').value,
        option2 : document.getElementById('option2').value,
        option3 : document.getElementById('option3').value,
        option4 : document.getElementById('option4').value,
        answer : 0,
        quizId : quizId
    };
    for(let i=0; i<4; i++){
        if(radios[i].checked){
            inputVals.answer = parseInt(radios[i].value);
            break;
        }
    }
    console.log(inputVals);
    if(inputVals.questionInWords=="" || inputVals.option1=="" || inputVals.option2=="" || inputVals.option3=="" || inputVals.option4=="")
      return;
    
    createAPIEndpoint(Endpoints.questions).post(inputVals).then((res)=>{
      //document.getElementById("quizName").value = "";
      handleChangePage(currentPage);
      handleClose();
      setReloadBool(!reloadBool);
    })
    .catch((err)=>{
      console.log(err);
    });
  }

  const editQuestion = (qId)=>{
    let radios = document.getElementsByName("row-radio-buttons-group");
    let inputVals = {
        id: qId,
        questionInWords : document.getElementById('question').value,
        option1 : document.getElementById('option1').value,
        option2 : document.getElementById('option2').value,
        option3 : document.getElementById('option3').value,
        option4 : document.getElementById('option4').value,
        answer : 0,
        quizId : quizId
    };
    for(let i=0; i<4; i++){
        if(radios[i].checked){
            inputVals.answer = parseInt(radios[i].value);
            break;
        }
    }
    if(inputVals.questionInWords=="" || inputVals.option1=="" || inputVals.option2=="" || inputVals.option3=="" || inputVals.option4=="")
      return;
    
    createAPIEndpoint(Endpoints.questions).put(qId,inputVals).then((res)=>{
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
      editQuestion(editId);  
    else
      addQuiz();
  }

  return (
    <>
    <div style={{width:"80%", margin:"auto", marginTop:"30px"}}>
      <Button onClick={handleOpen} variant='contained'>
        Create Question
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
          {editId>0 ? 'Edit Question' : 'New Question'}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <TextField 
                  variant='outlined' 
                  size='small'
                  label='Question'
                  id='question'
                  sx={{m:1, width:'90%'}}
                  defaultValue={modalValues.qInWords}
                  required
              />
              <TextField 
                  variant='outlined' 
                  size='small'
                  label='Option A'
                  id='option1'
                  sx={{m:1, width:'90%'}}
                  defaultValue={modalValues.opt1}
                  required
              />
              <TextField 
                  variant='outlined' 
                  size='small'
                  label='Option B'
                  id='option2'
                  sx={{m:1, width:'90%'}}
                  defaultValue={modalValues.opt2}
                  required
              />
              <TextField 
                  variant='outlined' 
                  size='small'
                  label='Option C'
                  id='option3'
                  sx={{m:1, width:'90%'}}
                  defaultValue={modalValues.opt3}
                  required
              />
              <TextField 
                  variant='outlined' 
                  size='small'
                  label='Option D'
                  id='option4'
                  sx={{m:1, width:'90%'}}
                  defaultValue={modalValues.opt4}
                  required
              />
              <FormControl size='small' sx={{m:1}}>
                <FormLabel id="row-radio-buttons-group-label">Answer</FormLabel>
                <RadioGroup
                    row
                    aria-labelledby="row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    id='answer'
                    defaultValue={modalValues.ans}
                >
                    <FormControlLabel value={0} control={<Radio />} label="A" />
                    <FormControlLabel value={1} control={<Radio />} label="B" />
                    <FormControlLabel value={2} control={<Radio />} label="C" />
                    <FormControlLabel value={3} control={<Radio />} label="D" />
                </RadioGroup>
              </FormControl>
              <Button
                  //type='submit'
                  variant='contained'
                  sx={{width:'90%', m:1}}
                  onClick={handleModalSubmit}
              >
                  Submit
              </Button>
          
        </Typography>
      </Box>
    </Modal>
    <div style={{width:"80%", margin:'auto', marginTop:'30px'}}>
      <DataTable
          title={"Question List for "+ quizName}
          columns={columns}
          data={data}
          //selectableRows // add for checkbox selection
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
