import { Card, CardContent, CardHeader, Typography } from '@mui/material';

const MessageCard = (props: any) => {
  return (
    <Card>
      <CardHeader title="Message" />
      <CardContent>
        <Typography component="div">Message here</Typography>
      </CardContent>
    </Card>
  );
};

export default MessageCard;
