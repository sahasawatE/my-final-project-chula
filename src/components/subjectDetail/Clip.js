import react from 'react';
// import { Player } from 'video-react';
import { FilePond } from 'react-filepond';
import { Grid } from '@material-ui/core';

import 'filepond/dist/filepond.min.css'
//https://video-react.js.org/
export default function Clip(props) {

    const [clips,setClips] = react.useState([]);

    return (
        <div>
            <div>
                {props.subject ? 
                    props.user.Teacher_id ? 
                        <Grid container justifyContent="center">
                            <div style={{ width: '90%' }} className='pdf-container'>
                                <FilePond
                                    files={clips}
                                    onupdatefiles={setClips}
                                    allowMultiple={true}
                                    maxFiles={3}
                                    allowDrop
                                    
                                    name="clip"
                                    credits={false}
                                    onprocessfiles={() => {
                                        
                                    }}
                                    labelIdle='ลากและวางคลิปสอนของคุณที่นี่ หรือ <span class="filepond--label-action">เลือก</span>'
                                />
                            </div>
                        </Grid>
                        :
                        <div>student route</div>
                    : 
                    'เลือกวิชาที่จะแสดง'
                }
            </div>
        </div>
    );
}