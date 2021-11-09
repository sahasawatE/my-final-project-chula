import react from 'react';
import {Typography,Button} from '@material-ui/core';

export default function ThreadReply(props){
    const [readMore, setReadMore] = react.useState(false);
    return(
        <div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Typography style={{ paddingTop: '4px', paddingLeft: '8px', color: '#afafaf' }}>{props.user}</Typography>
                <div style={{ display: 'flex', flexDirection: 'row', paddingTop: '4px', paddingRight: '8px', color: '#afafaf' }}>
                    <Typography style={{ paddingRight: '0.5rem' }}>{props.date === 'วันนี้' ? props.date : `${props.date?.split('-')[2]}/${props.date?.split('-')[1]}/${props.date?.split('-')[0]}`}</Typography>
                    <Typography>{props.time}</Typography>
                </div>
            </div>
            {props.content?.length > 180 ?
                readMore ?
                    <div>
                        <Typography style={{ paddingTop: '0.5vh', paddingLeft: '16px', paddingRight: '8px', paddingBottom: '0.5rem' }}>{props.content}</Typography>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button color='primary' onClick={() => setReadMore(false)}>ย่อ</Button>
                        </div>
                    </div>
                    :
                    <div>
                        <div style={{ height: '15vh', overflow: 'hidden' }}>
                            <Typography style={{ paddingTop: '0.5vh', paddingLeft: '16px', paddingRight: '8px', paddingBottom: '0.5rem' }}>{props.content}</Typography>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button color='primary' onClick={() => setReadMore(true)}>อ่านต่อ</Button>
                        </div>
                    </div>
                :
                <Typography style={{ paddingTop: '0.5vh', paddingLeft: '16px', paddingRight: '8px', paddingBottom: '0.5rem' }}>{props.content}</Typography>
            }
        </div>
    );
}