import { Grid, List, makeStyles } from "@material-ui/core";
// import TodoBlock from './TodoBlock';
//, ListSubheader
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        overflow: 'auto',
        maxHeight: 300,
    },
    listSection: {
        backgroundColor: 'inherit',
    },
    ul: {
        backgroundColor: 'inherit',
        padding: 0,
    },
}))

export default function Todo(props) {
    const classes = useStyles();
    // var today = new Date();
    const todo = props.todo;
    // const thisday = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
    if(todo){
        return (
            <Grid container direction="column">
                <b style={{ color: '#4171B9', padding: '1rem' }}>สิ่งที่ต้องทำ</b>
                <List className={classes.root} subheader={<li />}>
                    <li className={classes.listSection}>
                        <ul className={classes.ul}>
                            
                        </ul>
                    </li>
                </List>
            </Grid>
        );    
    }
    else{
        return(
            <div>
                ไม่มี
            </div>
        );
    }
}