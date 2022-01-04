import react from 'react';
import {ListItem} from '@material-ui/core'
import { Grid, Paper, InputBase, Typography, styled, List, ListItemIcon, ListItemText,IconButton, SwipeableDrawer, Box, Chip, Stack, Collapse, Alert } from '@mui/material'
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { useMediaQuery } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios';

const drawerBleeding = 56;

require('dotenv').config()

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export default function School(props,{ forwardedRef }) {
    const { canva } = props;
    const mobile = useMediaQuery('(min-width:600px)');
    const ngrok = process.env.REACT_APP_NGROK_URL;
    const api = axios.create({ baseURL: ngrok })

    const [selectTeacher, setSelectTeacher] = react.useState(null);
    const [openAlert, setOpenAlert] = react.useState(false);

    const teacherSubject = ['ฝ่ายปกครอง','แนะแนว','คณิตศาสตร์','ภาษาไทย','ภาษาต่างประเทศ','วิทยาศาสตร์','สังคมศึกษา ศาสนาและวัฒนธรรม','สุขศึกษาและพละศึกษา','ศิลปะ','การงานอาชีพและเทคโนโลยี'];
    const [listData, setListData] = react.useState([[], [], [], [], [], [], [], [], [], []]);
    const container = canva !== undefined ? () => canva().document.body : undefined;
    const [open, setOpen] = react.useState(false);
    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    react.useEffect(() => {
        const data0 = [];
        const data1 = [];
        const data2 = [];
        const data3 = [];
        const data4 = [];
        const data5 = [];
        const data6 = [];
        const data7 = [];
        const data8 = [];
        const data9 = [];
        api.get('/teacherList').then(res => {
            setSelectTeacher(res.data.filter(e => e.main_year === 'ผอ')[0])
            res.data.map(v => {
                if (v.Major === 'ฝ่ายปกครอง') {
                    data0.push(v)
                }
                else if (v.Major === 'แนะแนว') {
                    data1.push(v)
                }
                else if (v.Major === 'คณิตศาสตร์') {
                    data2.push(v)
                }
                else if (v.Major === 'ภาษาไทย') {
                    data3.push(v)
                }
                else if (v.Major === 'ภาษาต่างประเทศ') {
                    data4.push(v)
                }
                else if (v.Major === 'วิทยาศาสตร์') {
                    data5.push(v)
                }
                else if (v.Major === 'สังคมศึกษา ศาสนาและวัฒนธรรม') {
                    data6.push(v)
                }
                else if (v.Major === 'สุขศึกษาและพละศึกษา') {
                    data7.push(v)
                }
                else if (v.Major === 'ศิลปะ') {
                    data8.push(v)
                }
                else if (v.Major === 'การงานอาชีพและเทคโนโลยี') {
                    data9.push(v)
                }
                return null;
            })
            setListData([data0,data1,data2,data3,data4,data5,data6,data7,data8,data9])
        }).catch(err => console.log(err))
    },[])

    const [expanded, setExpanded] = react.useState('ฝ่ายปกครอง');

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };
    const [searchString, setSearchString] = react.useState('');
    const [searchTeacher, setSearchTeacher] = react.useState([]);

    react.useEffect(() => {
        setTimeout(() => setOpenAlert(false),5000)
    },[openAlert,setOpenAlert])

    return(
    <div ref={forwardedRef} className="App" style={{height:'71vh'}}>
        <Grid container direction='row' justifyContent='center'>
            <Grid item xs={mobile ? 5 : 12} style={{height:'100%',marginTop:'2rem'}}>
                <div style={{marginRight:mobile ? '0.25rem' : '0.75rem',marginLeft:'0.75rem'}}>
                    <Paper component="form" style={{ padding: '4px 8px', display: 'flex', alignItems: 'center', width: '100%', backgroundColor: '#ffffff', borderRadius: '16px' }}>
                        <SearchIcon />
                        <InputBase
                            style={{ flex: 1, width: '100%' }}
                            placeholder=" ค้นหาครู"
                            inputProps={{ 'aria-label': ' ค้นหานักเรียน' }}
                            value={searchString}
                            onChange={(event) => {
                                setSearchString(event.target.value)
                                const searchResult = listData.map((v1) => {
                                    var listResult;
                                    if(v1.length > 0){
                                        listResult = v1.filter(element => {
                                            const regex = new RegExp(`^${event.target.value}`, 'gi');
                                            return element.Teacher_FirstName.match(regex) || element.Teacher_LastName.match(regex) || element.Major.match(regex)
                                        })
                                    }
                                    return (listResult)
                                })

                                if (event.target.value.length === 0) {
                                    setSearchTeacher([]);
                                }
                                else {
                                    setSearchTeacher(searchResult.filter(e => e !== undefined).filter(e => e.length !== 0).map(v => {
                                        return(v[0])
                                    }))
                                }
                            }}
                        />
                        {searchString.length !== 0 &&
                            <IconButton style={{ width: '2rem', height: '2rem' }} onClick={() => {
                                setSearchString('');
                                setSearchTeacher([]);
                            }} color='error'>
                                <ClearIcon />
                            </IconButton>
                        }
                    </Paper>
                        {searchTeacher.length !== 0 &&
                            <Grid container direction='column' style={{ zIndex: '100', position: 'absolute' }}>
                                <Grid item xs={12}>
                                    <Paper style={{ width: mobile ? '40.5vw' : '95vw', marginTop: '0.1rem', maxHeight: '32vh', overflow: 'scroll', borderRadius: '16px' }}>
                                        <div style={{ padding: '0.5rem' }}>
                                            <List>
                                                {searchTeacher.length !== 0 &&
                                                    searchTeacher.map((value, index) => {
                                                        if(value !== undefined){
                                                            return (
                                                                <ListItem button onClick={() => {
                                                                    setSelectTeacher(value)
                                                                    setSearchTeacher([])
                                                                    setExpanded(value.Major)
                                                                    if(!mobile){
                                                                        setOpen(true)
                                                                    }
                                                                }} key={`searchResultNO${index}`}>
                                                                    <ListItemIcon><AccountCircleIcon sx={{ fontSize: 40 }} /></ListItemIcon>
                                                                    <ListItemText primary={`${value?.Teacher_FirstName} ${value?.Teacher_LastName}`} secondary={value?.Major} />
                                                                </ListItem>
                                                            );
                                                        }
                                                        else{
                                                            return null
                                                        }
                                                    })
                                                }
                                            </List>
                                        </div>
                                    </Paper>
                                </Grid>
                            </Grid>
                        }
                    <Paper style={{display:'flex',flexDirection:'column',marginTop:'0.5rem',maxHeight:'71vh',overflow:'scroll', borderRadius:'16px'}}>
                    {teacherSubject.map((value,index) => {
                        return(
                        <div key={`teacherNO${index}`}>
                            <Accordion expanded={expanded === value} onChange={handleChange(value)}>
                                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                                    <Typography>{value}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <List>
                                        {
                                        listData[index].length !== 0 ? 
                                        listData[index].map((value1, index1) => {
                                            return(
                                                <ListItem key={`teacherDetailNO${index1}`} style={value1.Teacher_id === selectTeacher.Teacher_id ? { backgroundColor: "rgba(255, 215, 0, 0.5)", borderRadius: '0.5rem' } : { borderRadius: '0.5rem' }} button onClick={() => {
                                                    setSelectTeacher(value1)
                                                    if(!mobile){
                                                        setOpen(true)
                                                    }
                                                }}>
                                                    <ListItemIcon>
                                                        <AccountCircleIcon/>
                                                    </ListItemIcon>
                                                    <ListItemText>
                                                        <Typography>{value1.Teacher_FirstName} {value1.Teacher_LastName}</Typography>
                                                    </ListItemText>
                                                </ListItem>
                                            );
                                        })
                                        : 
                                        <ListItem>
                                            <ListItemText>
                                                ว่างเปล่า
                                            </ListItemText>
                                        </ListItem>
                                        }
                                    </List>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                        )
                    })}
                    </Paper>
                </div>
            </Grid>
            {mobile ?
             <Grid item xs={3} style={{height:'100%',marginTop:'2rem'}}>
                <Paper style={{marginLeft:'0.25rem',marginRight:'0.75rem', borderRadius:'16px'}}>
                    {selectTeacher && 
                    <div style={{ paddingLeft: '1rem', overflow: 'scroll', maxHeight: '77vh',height:'77vh',width:'100%'}}>
                        <Grid container justifyContent='center' direction='row' style={{paddingTop:'1rem'}}>
                            <Grid item xs={3}><AccountCircleIcon sx={{ fontSize: '4rem' }} /></Grid>
                            <Grid item xs={9}>
                                <Grid container justifyContent='flex-start' direction='column' style={{paddingLeft:'0.5rem'}}>
                                    <Grid item xs={12} style={{paddingTop:'0.7rem'}}><Typography>{`${selectTeacher.Teacher_FirstName} ${selectTeacher.Teacher_LastName}`}</Typography></Grid>
                                    <Grid item xs={12}><Typography>{selectTeacher.Major}</Typography></Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <br/>
                        <Grid item xs={10} style={{paddingLeft:'2rem'}}>
                            <Grid container justifyContent='flex-start' direction='column'>
                                {selectTeacher.Teacher_Phone.length !== 0 &&
                                <a href={`tel:${selectTeacher.Teacher_Phone}`}>
                                    <Grid container style={{paddingBottom:'0.5rem'}}>
                                        <Grid item xs={2}><LocalPhoneIcon/></Grid>
                                        <Grid item xs={10} style={{paddingLeft:'0.5rem'}}>{selectTeacher.Teacher_Phone}</Grid>
                                    </Grid>
                                </a>}
                                {String(selectTeacher.Teacher_Email).length !== 0 &&
                                <a href={`mailto:${selectTeacher.Teacher_Email}`} target="_blank" rel="noreferrer">
                                    <Grid container style={{ paddingBottom: '0.5rem' }}>
                                        <Grid item xs={2}><EmailIcon /></Grid>
                                        <Grid item xs={10} style={{paddingLeft:'0.5rem'}}>{selectTeacher.Teacher_Email}</Grid>
                                    </Grid>
                                </a>}
                                {String(selectTeacher.Teacher_Office).length !== 0 &&
                                <Grid container style={{ paddingBottom: '0.5rem' }}>
                                    <Grid item xs={2}><LocationOnIcon /></Grid>
                                    <Grid item xs={10} style={{paddingLeft:'0.5rem'}}>{selectTeacher.Teacher_Office}</Grid>
                                </Grid>}
                                {String(selectTeacher.Teacher_LineId).length !== 0 &&
                                <Grid container style={{ paddingBottom: '0.5rem' }}>
                                    <Grid item xs={2}><img alt='hok1' style={{ height: '1.8rem', width: '1.8rem' }} src="https://img.icons8.com/color/144/000000/line-me.png" /></Grid>
                                    <Grid item xs={10} style={{paddingLeft:'0.5rem'}}>{selectTeacher.Teacher_LineId}</Grid>
                                </Grid>}
                                {selectTeacher.Teacher_Facebook !== null &&
                                <Grid container style={{ paddingBottom: '0.5rem' }}>
                                    <Grid item xs={2}><img alt='hok2' style={{ height: '1.8rem', width: '1.8rem' }} src="https://img.icons8.com/fluency/144/000000/facebook-new.png" /></Grid>
                                    <Grid item xs={10} style={{paddingLeft:'0.5rem'}}>{selectTeacher.Teacher_Facebook}</Grid>
                                </Grid>}
                            </Grid>
                        </Grid>
                    </div>
                    }
                </Paper>
            </Grid>
            :
            selectTeacher && 
            <SwipeableDrawer
                container={container}
                anchor="bottom"
                open={open}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
                swipeAreaWidth={drawerBleeding}
                disableSwipeToOpen={false}
                ModalProps={{
                    keepMounted: true,
                }}
            >
                <Box
                    sx={{
                        px: 2,
                        pb: 8,
                        height: '100%',
                        overflow: 'auto',
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                    }}
                >
                    <Grid container justifyContent='center'>
                        <Grid item style={{ marginTop: '1.5rem',display:'flex',justifyContent:'center' }} xs={12}><AccountCircleIcon sx={{ fontSize: '7rem' }} /></Grid>
                        <Grid item style={{ margin: '2rem',display:'flex',justifyContent:'center' }} xs={12}>
                            <Typography variant="h5" gutterBottom style={{textAlign:'center'}}>{selectTeacher.Teacher_FirstName} {selectTeacher.Teacher_LastName}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Stack spacing={1} alignItems='center'>
                                <Stack direction='row' spacing={1}>
                                    {selectTeacher.Teacher_Phone.length !== 0 &&
                                        <Chip
                                            onClick={() => window.open(`tel:${selectTeacher.Teacher_Phone}`)}
                                            color='primary'
                                            icon={<LocalPhoneIcon/>}
                                            label={selectTeacher.Teacher_Phone}
                                        />
                                    }
                                    {String(selectTeacher.Teacher_Email).length !== 0 &&
                                        <Chip
                                            onClick={() => window.open(`mailto:${selectTeacher.Teacher_Email}`,'_blank')}
                                            color='secondary'
                                            icon={<EmailIcon/>}
                                            label={selectTeacher.Teacher_Email}
                                        />
                                    }
                                </Stack>
                                <Stack direction='row' spacing={1}>
                                    {String(selectTeacher.Teacher_Office).length !== 0 &&
                                        <Chip
                                            variant="outlined"
                                            icon={<LocationOnIcon/>}
                                            label={<Typography noWrap style={{ maxWidth: '50vw' }}>{selectTeacher.Teacher_Office}</Typography>}
                                        />
                                    }
                                </Stack>
                                <Stack direction='row' spacing={1}>
                                    {String(selectTeacher.Teacher_LineId).length !== 0 &&
                                        <Chip
                                            variant="outlined"
                                            color='success'
                                            onClick={() => {
                                                navigator.clipboard.writeText(selectTeacher.Teacher_LineId)
                                                setOpenAlert(true)
                                            }}
                                            icon={<img alt='hok1' style={{ height: '1.8rem', width: '1.8rem' }} src="https://img.icons8.com/color/144/000000/line-me.png" />}
                                            label={<Typography noWrap style={{ maxWidth: '25vw' }}>{selectTeacher.Teacher_LineId}</Typography>}
                                        />
                                    }
                                    {selectTeacher.Teacher_Facebook !== null &&
                                        <Chip
                                            variant="outlined"
                                            color='primary'
                                            onClick={() => {
                                                navigator.clipboard.writeText(selectTeacher.Teacher_Facebook)
                                                setOpenAlert(true)
                                            }}
                                            icon={<img alt='hok2' style={{ height: '1.8rem', width: '1.8rem' }} src="https://img.icons8.com/fluency/144/000000/facebook-new.png" />}
                                            label={<Typography noWrap style={{ maxWidth: '25vw' }}>{selectTeacher.Teacher_Facebook}</Typography>}
                                        />
                                    }
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>
                    <br/>
                    <Collapse in={openAlert}>
                        <Alert>
                            คัดลอกเรียบร้อย
                        </Alert>
                    </Collapse>
                </Box>
            </SwipeableDrawer>
        }
        </Grid>
    </div>        
    );
}