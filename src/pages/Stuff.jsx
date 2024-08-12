import React, { useEffect, useState } from "react";
import '../firebaseConfig';
import { getDocs, collection, getFirestore, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';

export default function Stuff() {
  const db = getFirestore();
  const [stuff, setData] = useState([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [require, setRequire] = useState(false);
  const [ready, setReady] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [sum, setSum] = useState(null);


  useEffect(() => {
    fetchStuff();    
  }, []);
  

  const fetchStuff = async () => {
    const qs = await getDocs(collection(db, 'stuff'));
    const res = [];
    let resSum = 0;
    qs.forEach((doc) => {
      let item = doc.data();
      item['id'] = doc.id;
      res.push(item);
      let resItemSum = item.amount * item.price;
      resSum += resItemSum;
    });
    if (res.length) {
      setData(res);
      setSum(resSum);
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

  const handleChangeReady = (event) => {
    event.preventDefault();
    if (selectedItem) {
      
      (async () => {   
        try {
          const docRef = doc(db, 'stuff', selectedItem.id)   
            console.log({
              name: name,
              amount: amount,
              price: price,
              require: require,
              ready: !ready
            });
            
            let updItem = {
              name: name,
              amount: amount,
              price: price,
              require: require,
              ready: !ready
            }
            await updateDoc(docRef, updItem);
            setReady(!ready);
            // setSelectedItem(updItem);
          // handleClose();
          fetchStuff();
        } catch (e) {
          console.error("Error edit item");
        }
      })();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedItem) {
      (async () => {   
        try {
          const docRef = doc(db, 'stuff', selectedItem.id)
          console.log('docRef', docRef);
          
          await updateDoc(docRef, {
            name: name,
            amount: amount,
            price: price,
            require: require
          });
          handleClose();
          fetchStuff();
        } catch (e) {
          console.error("Error edit item");
        }
      })();
    } else {
      const newItem = {
        name: name,
        amount: amount,
        price: price,
        require: require
      };
      (async () => {   
        try {
          await addDoc(collection(db, "stuff"), newItem);
          handleClose();
          fetchStuff();
        } catch (e) {
          console.error("Error adding item");
        }
      })();
    }
  };
  
  const resForm = () => {
    setName('');
    setAmount('');
    setPrice('');
    setRequire(false);
  };

  const selectItem = (item) => {
    setSelectedItem(item);
    setName(item.name);
    setAmount(item.amount);
    setPrice(item.price);
    setRequire(item.require);
    setReady(item.ready);
    handleShow();
  }
  
  const deleteItem = async () => {
    try {
      const docRef = doc(db, 'stuff', selectedItem.id)
      await deleteDoc(docRef);
      handleClose();
      fetchStuff();
    } catch (e) {
      console.error("Error adding item");
    }
  }

  const handleClose = () => {
    setShow(false);
    setSelectedItem(null);
    resForm();
  };

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
            {/* <th>require</th> */}
            <th>total</th>
          </tr>
        </thead>
        <tbody>
          {stuff.map((item, index) => (
            <tr key={index} onClick={() => selectItem(item)} className={item.ready ? 'ready' : ''}>
              <td>{ index +1 }</td>
              <td>{ item.name }</td>
              <td>{ item.amount }</td>
              <td>{ item.price }</td>
              {/* <td>{ item.require ? 'true' : 'false' }</td> */}
              <td>{ item.amount * item.price }</td>
            </tr>
           ))}

           <tr>
            <td colSpan={4}>total</td>
            <td>{ sum }</td>
           </tr>
        </tbody>
      </Table>
      

      <Modal show={show} onHide={handleClose} className="itemModal">
        <Form className="form" onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Item modal</Modal.Title>
          </Modal.Header>

          <Modal.Body className="itemModal_body">
            <FloatingLabel controlId="name" label="name">
              <Form.Control disabled={ready} value={name} type="text" placeholder="" onChange={handleChangeName} />
            </FloatingLabel>

            <FloatingLabel controlId="amount" label="amount">
              <Form.Control disabled={ready} value={amount} type="number" min={0} placeholder="" onChange={handleChangeAmount} />
            </FloatingLabel>

            <FloatingLabel controlId="price" label="price">
              <Form.Control disabled={ready} value={price} type="number" min={0} placeholder="" onChange={handleChangePrice} />
            </FloatingLabel>

            {/* <Form.Check
              value={require}
              type="switch"
              id="require"
              label="require"
              onChange={handleChangeRequire} 
            /> */}

          </Modal.Body>
          
          <Modal.Footer className="itemModal_footer">
            <div className="left">
              { selectedItem && 
                <Button variant="danger" onClick={deleteItem}>
                  delete
                </Button>
              }
              { (selectedItem && !ready) &&
                <Button variant="success" onClick={handleChangeReady}>ready</Button>
              }
              { (selectedItem && ready) &&
                <Button variant="warning" onClick={handleChangeReady}>process</Button>
              }
            </div>

            <div className="right">
              <Button variant="secondary" onClick={handleClose}>
                close
              </Button>
              <Button variant="primary" type="submit">
                { selectedItem ? 'save' : 'add' }
              </Button>
            </div>
          </Modal.Footer>
        </Form>
      </Modal>

    </div>
  )
}
