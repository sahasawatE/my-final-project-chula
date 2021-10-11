import { Button, Grid, ListItem } from "@material-ui/core";

export default function TodoBlock(props) {
    return (
        <ListItem key={props.key}>
            <Button style={{ width: '100%' }}>
                <Grid container direction="row" alignContent="center" justifyContent="center">
                    <Grid item sm={2}>
                        <div>
                            <div>{props.time}</div>
                        </div>
                    </Grid>
                    <Grid item sm={10}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>{props.subject}</div>
                    </Grid>
                </Grid>
            </Button>
        </ListItem>
    );
}