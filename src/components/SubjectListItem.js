import react from 'react';
import { ListItemButton, ListItemText, Typography } from "@mui/material";
import { subjectContext } from './subjectContext';

export default function SubjectListItem(props) {

    const { selectSubject, setSelectSubject } = react.useContext(subjectContext);

    if(props.user === 'teacher'){
        return (
            <ListItemButton 
                onClick={() => {
                    setSelectSubject({
                        name: props.value.subjectId,
                        day: '',
                        room: props.value.roomId
                    });
                }} 
                style={selectSubject ?
                    selectSubject.name === props.value.subjectId && selectSubject.room === props.value.roomId ? { backgroundColor: "rgba(255, 215, 0, 0.5)", borderRadius:'0.5rem' } : null
                :
                null}>
                <ListItemText
                    primary={<Typography style={selectSubject ?
                        selectSubject.name === props.value.subjectId && selectSubject.room === props.value.roomId ? { color: 'black' } : null
                        :
                        null
                    }>{`${props.value.name} ${props.value.room}`}</Typography>}
                    secondary={props.value.subjectId}
                />
            </ListItemButton>
        );
    }
    else{
        return(
            <ListItemButton 
                onClick={() => {
                    setSelectSubject({
                        name: props.value.subjectId,
                        day: '',
                        room: props.value.roomId
                    });
                }} 
                style={selectSubject ?
                    selectSubject.name === props.value.subjectId && selectSubject.room === props.value.roomId ? { backgroundColor: "rgba(107, 158, 255, 0.5)", borderRadius: '0.5rem'} : null
                :
                null}>
                <ListItemText
                    primary={<Typography style={selectSubject ?
                        selectSubject.name === props.value.subjectId && selectSubject.room === props.value.roomId ? { color: 'black' } : null
                        :
                        null
                    }>{props.value.name}</Typography>}
                    secondary={props.value.subjectId}
                />
            </ListItemButton>
        );
    }
}