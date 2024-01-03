import { useEffect, useState } from "react";

const OrderShow = ({ order }) => {
    const [timeleft, setTimeLeft] = useState(0);

    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft/1000));
        };

        findTimeLeft();
        const timerId = setInterval(findTimeLeft, 1000);

        return () => {
            clearInterval(timerId);
        };
    }, [])
    
    return (
        <div>
            <h1>OrderShow</h1>
            {timeleft>0 ? <div>{timeleft} seconds until order expires</div> : <div>Order Expired</div>}
        </div>
    )
};

OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);

    return { order : data};
}

export default OrderShow;