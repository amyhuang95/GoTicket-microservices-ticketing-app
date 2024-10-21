/**
 * Page to create a new ticket
 */
import { useState } from 'react';
import useRequest from '../../hooks/use-request';

const NewTicket = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  // hook to make a request to the server
  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price,
    },
    onSuccess: (ticket) => {
      console.log(ticket);
    },
  });

  // handle form submission
  const onSubmit = (event) => {
    event.preventDefault();
    // make a request to the server
    doRequest();
  };

  // auto-format numbers to 2 decimals
  const onBlur = () => {
    const value = parseFloat(price);

    // Check if it's not a number
    if (isNaN(value)) {
      return;
    }

    // Set price to round to 2 decimals
    setPrice(value.toFixed(2));
  };

  return (
    <div>
      <h1>Create a new ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            value={price}
            onBlur={onBlur} // a Blur event is when user click outside of the input field
            onChange={(e) => {
              setPrice(e.target.value);
            }}
            className="form-control"
          />
        </div>
        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default NewTicket;
