import React, { useEffect, useState } from "react";
import '../firebaseConfig';
import { getDocs, collection, getFirestore, addDoc, deleteDoc, doc } from "firebase/firestore";
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';

export default function Stuff() {
  const [stuff, setData] = useState([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState(0);
  const [price, setPrice] = useState(0);
  const [require, setRequire] = useState(false);
  const [show, setShow] = useState(false);
  const db = getFirestore();


  useEffect(() => {
    fetchStuff();    
  }, []);
  

  const fetchStuff = async () => {
    const qs = await getDocs(collection(db, 'stuff'));
    const res = [];
    qs.forEach((doc) => {
      let item = doc.data();
      item['id'] = doc.id;
      res.push(item);
    });
    if (res.length) {
      setData(res);
      console.log('stuff', stuff);
    };
  };
  
  const handleChangeName = (event) => {
    setName(event.target.value);
  };
  const handleChangeAmount = (event) => {
    setAmount(event.target.value);
  };
  const handleChangePrice = (event) => {
    setPrice(event.target.value);
  };
  const handleChangeRequire = (event) => {
    setRequire(event.target.checked);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newItem = {
      name: name,
      amount: amount,
      price: price,
      require: require
    };
    (async () => {   
      try {
        await addDoc(collection(db, "stuff"), newItem);
        event.target.reset();
        resForm();
        handleClose();
        fetchStuff();
      } catch (e) {
        console.error("Error adding item");
      }
    })();
  };
  
  const resForm = () => {
    setName('');
    setAmount(0);
    setPrice(0);
    setRequire(false);
  };

  const selectItem = (item) => {
    console.log(item);
    deleteItem(item.id)
  }
  
  const deleteItem = async (id) => {
    try {
      const docRef = doc(db, 'stuff', id)
      await deleteDoc(docRef)
      fetchStuff();
    } catch (e) {
      console.error("Error adding item");
    }
  }


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  

  return (
    <div className='page stuff'>
      <h3 className="page_title">Stuff</h3>
      <Button variant="primary" onClick={handleShow}>
        add new Item
      </Button>


      <Table striped bordered hover responsive className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>name</th>
            <th>amount</th>
            <th>price</th>
            <th>require</th>
          </tr>
        </thead>
        <tbody>
          {stuff.map((item, index) => (
            <tr key={index} onClick={() => selectItem(item)}>
              <td>{ index +1 }</td>
              <td>{ item.name }</td>
              <td>{ item.amount }</td>
              <td>{ item.price }</td>
              <td>{ item.require ? 'true' : 'false' }</td>
            </tr>
           ))}
        </tbody>
      </Table>
      

      <Modal show={show} onHide={handleClose} className="itemModal">
        <Form className="form" onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Item modal</Modal.Title>
          </Modal.Header>

          <Modal.Body className="itemModal_body">
              <FloatingLabel controlId="name" label="name">
                <Form.Control type="text" placeholder="" onChange={handleChangeName} />
              </FloatingLabel>

              <FloatingLabel controlId="amount" label="amount">
                <Form.Control type="number" min={0} placeholder="" onChange={handleChangeAmount} />
              </FloatingLabel>

              <FloatingLabel controlId="price" label="price">
                <Form.Control type="number" min={0} placeholder="" onChange={handleChangePrice} />
              </FloatingLabel>

              <Form.Check
                type="switch"
                id="require"
                label="require"
                onChange={handleChangeRequire} 
              />

              <Button variant="primary" type="submit">
                add
              </Button>
          </Modal.Body>
          
          <Modal.Footer className="itemModal_footer">
            <div className="left">
              <Button variant="danger" onClick={handleClose}>
                Delete
              </Button>
            </div>

            <div className="right">
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </Modal.Footer>
        </Form>
      </Modal>

    </div>
  )
}
