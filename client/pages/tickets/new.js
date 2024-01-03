import axios from "axios";
import { useState } from "react";

const NewTicket = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [backendErrors, setBackendErrors] = useState([]);

  const onBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  };

  const Submit = async (e) => {
    e.preventDefault();
    console.log(title);
    console.log(price);

    await axios
      .post("/api/tickets", {
        title,
        price,
      })
      .then((response) => {
        console.log(response?.data);
        setBackendErrors([]);
        setPrice("");
        setTitle("");
      })
      .catch(({ response }) => {
        console.log(response.data);
        setBackendErrors(response.data.errors);
      });
  };

  return (
    <div>
      <h1>Create a Ticket</h1>
      <form>
        <div>
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label>Price</label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onBlur={onBlur}
          />
        </div>
        {backendErrors &&
        backendErrors.map((error, index) => {
          return <p key={index} className="text-red-500 text-xs">{error.message}</p>;
        })}
        <button onClick={Submit}>Submit</button>
      </form>      
    </div>
  );
};

export default NewTicket;
