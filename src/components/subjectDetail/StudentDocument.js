import * as react from 'react';
import { List, ListItem, ListItemText, Grid, Typography } from '@material-ui/core';
import axios from 'axios';
import FolderIcon from '@material-ui/icons/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { Modal } from 'react-bootstrap';
import { blue, grey } from '@mui/material/colors';

var b64toBlob = require('b64-to-blob');
require('dotenv').config()

export default function StudentDocument(props){
    const ngrok = process.env.REACT_APP_NGROK_URL;
    const api = axios.create({ baseURL: ngrok })
    const [files, setFiles] = react.useState([]);
    const [folders, setFolders] = react.useState([]);
    const [enterFolder, setEnterFolder] = react.useState(false);
    const [selectFolder, setSelectFolder] = react.useState('');
    const [noFolderFiles, setNoFolderFiles] = react.useState([]);

    react.useEffect(() => {
        setFolders([]);
        setNoFolderFiles([]);
        if(props.subject){
            api.post('/student/allFiles',{
                Room_id : props.user.Room_id,
                Subject_id : props.subject.Subject_id
            }).then(res => {
                var f = [];
                if(res.data !== 'empty'){
                    res.data.map(v => {
                        if (v.path.split('/').at(-1) === 'noFolder') {
                            api.post('/student/files', {
                                fileId: v.fileId
                            }).then(result => {
                                if (result.data !== 'empty') {
                                    setNoFolderFiles(result.data)
                                }
                            }).catch(err2 => console.log(err2))
                        }
                        else {
                            f.push(v)
                        }
                        return null
                    })
                    setFolders(f)
                }
            }).catch(err => console.log(err))
        }
    },[props.subject])

    function getFile(fileId){
        api.post('/student/files',{
            fileId : fileId
        }).then(res => {
            if (res.data !== 'empty') {
                setFiles(res.data)
            }
        }).then(setEnterFolder(true)).catch(err => console.log(err))
    }

    function File(file) {
        api.post('/teacher/file', {
            filePath: file
        }).then(result => {
            var blob = b64toBlob(result.data, "application/pdf")
            var blobUrl = URL.createObjectURL(blob);
            window.open(blobUrl, '_blank');
        }).catch(err => console.log(err))
    }

    return (
        <div>
            <Grid container justifyContent='center'>
                {noFolderFiles.length === 0 && folders.length ===0 ?
                <Typography>ว่างเปล่า</Typography>
                :
                <List style={{ width: '90%' }}>
                    {folders.length !== 0 && folders.map((value, index) => {
                        if (value.path.split('/').at(-1) !== 'noFolder'){
                            return (
                                <ListItem key={`folderNo${index}`} button onClick={() => {
                                    getFile(value.fileId);
                                    setSelectFolder(value.path.split('/').at(-1))
                                }}>
                                    <FolderIcon style={{color:grey[600]}}/>
                                    <ListItemText style={{ paddingLeft: '1rem' }} >{value.path.split('/').at(-1)}</ListItemText>
                                </ListItem>
                            );
                        }
                        else{
                            return null
                        }
                    })}
                    {noFolderFiles.length !== 0 && noFolderFiles.map((value, index) => {
                        return(
                            <ListItem key={`noFolderFileNO${index}`} button onClick={() => File(value.File_Path)}>
                                <InsertDriveFileIcon style={{color:blue[800]}}/>
                                <ListItemText style={{ paddingLeft: '1rem' }} >{value.File_Path.split('\\').pop().split('/').pop()}</ListItemText>
                            </ListItem>
                        );
                    })}
                </List>
                }
            </Grid>

            {/* Modal */}
            <div>
                <Modal centered show={enterFolder} backdropClassName="modal" backdrop="static" onHide={() => {
                    setSelectFolder('');
                    setEnterFolder(false);
                    setFiles([]);
                }}>
                    <Modal.Header closeButton>
                        <div style={{ display: 'flex', flexDirection: 'row', color: 'gray' }}>
                            <FolderIcon style={{color:grey[800]}}/><Typography style={{ paddingLeft: '1rem', color: 'black' }}>{selectFolder}</Typography>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <Grid container justifyContent='center'>
                            <List style={{ width: '90%' }}>
                                {files.length !== 0 ?
                                    files.map((value, index) => {
                                        return(
                                            <ListItem key={`fileInFolderNo${index}`} button onClick={() => File(value.File_Path)}>
                                                <InsertDriveFileIcon  style={{color:blue[800]}}/>
                                                <ListItemText style={{ paddingLeft: '1rem' }} >{value.File_Path.split('\\').pop().split('/').pop()}</ListItemText>
                                            </ListItem>
                                        );
                                    })
                                    :
                                    <Typography>ว่างเปล่า</Typography>
                                }
                            </List>
                        </Grid>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
}