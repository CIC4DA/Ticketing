import axios from "axios";
import Router from "next/router";
import { useState } from "react";

const TicketShow = ({ ticket }) => {
  const [backendErrors, setBackendErrors] = useState([]);

  const createOrder = async () => {
    await axios
      .post("/api/orders", {
        ticketId: ticket.id
      })
      .then((response) => {
        console.log(response.data);
        setBackendErrors([]);
        Router.push('/orders/[orderId]', `/orders/${response.data.id}`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <h1 className="text-[50px] font-medium">Ticket Show</h1>
      <h1 className="text-[20px] font-medium">Ticket Title : {ticket.title}</h1>
      <h1 className="text-[20px] font-medium">
        Ticket Price : ₹{ticket.price}
      </h1>
      {backendErrors &&
        backendErrors.map((error, index) => {
          return <p key={index} className="text-red-500 text-xs">{error.message}</p>;
        })}
      <button className="border-[1px] p-2" onClick={createOrder}>Purchase</button>
    </div>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);
  return { ticket: data };
};

export default TicketShow;
