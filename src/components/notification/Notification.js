import react from 'react';
import { Grid, List, makeStyles, ListSubheader } from "@material-ui/core";
import NotiBlock from './NotiBlock';

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
    }
}))

export default function Notification(props, { forwardedRef}) {
    const [filterDate, setFilterDate] = react.useState([]);
    const classes = useStyles();
    const noti = props.noti;
    const d = new Date();
    var m = d.getMonth() + 1;
    var day = d.getDate();

    if(m < 10){
        m = 0 + String(m)
    }
    else{
        m = d.getMonth() + 1
    }

    if (day < 10) {
        day = 0 + String(day)
    }
    else {
        day = d.getDate()
    }


    const today = `${d.getFullYear()}-${m}-${day}`

    react.useEffect(() => {
        var date = [];
        noti.map(v => {
            date.push(v.Noti_Time.split(" ")[0]);
            return null;
        })
        setFilterDate(uniq(date).reverse());    
    },[noti])
    
    function uniq(a) {
        var seen = {};
        return a.filter(function (item) {
            return seen.hasOwnProperty(item) ? false : (seen[item] = true);
        });
    }
    // filterDate.map(v => console.log(today === v))
    return (
        <Grid container direction="column" innerRef={forwardedRef}>
            <b style={{ color: '#4171B9', padding: '1rem' }}>แจ้งเตือน</b>
            <List className={classes.root} sx={{
                width: '100%',
                maxWidth: 260,
                bgcolor: 'background.paper',
                position: 'relative',
                overflow: 'auto',
                maxHeight: 300,
                '& ul': { padding: 0 },
            }} subheader={<li />}>
                {filterDate.map((value,index) => {
                    return(
                        <li className={classes.listSection} key={`section-${index}`}>
                            <ul>
                                {value === today ?
                                    <div key={index}>
                                        <ListSubheader style={{ height: '2.5rem', backgroundColor: 'white' }}>วันนี้</ListSubheader>
                                        {noti.reverse().map((v, i) => {
                                            if (v.Noti_Time.split(" ")[0] === value) {
                                                return (
                                                    <NotiBlock key={`item-${index}-${i}`} time={[String(v.Noti_Time.split(" ")[1].split(".")[0].split(":")[0]), String(v.Noti_Time.split(" ")[1].split(".")[0].split(":")[1])]} subject={v.Subject_id} title={v.Noti_Detail} room={v.Room_id}/>
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>
                                    :
                                    <div key={index}>
                                        <ListSubheader style={{height:'2.5rem',backgroundColor:'white'}}>{`${value.split('-')[2]} / ${value.split('-')[1]} / ${value.split('-')[0]}`}</ListSubheader>
                                        {noti.reverse().map((v, i) => {
                                            if (v.Noti_Time.split(" ")[0] === value) {
                                                return (
                                                    <div key={`item-${index}-${i}`}>
                                                        <NotiBlock key={`item-${index}-${i}`} time={[String(v.Noti_Time.split(" ")[1].split(".")[0].split(":")[0]), String(v.Noti_Time.split(" ")[1].split(".")[0].split(":")[1])]} subject={v.Subject_id} title={v.Noti_Detail} room={v.Room_id} />
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>
                                }
                            </ul>
                        </li>
                    ) 
                })}
            </List>
        </Grid>
    );
}