import React, { useEffect, useState } from "react";
import '../firebaseConfig';
import { getDocs, collection, getFirestore, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';

export default function Stuff() {
  const db = getFirestore();
  const [loading, setLoading] = useState(false);
  const [stuff, setData] = useState([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [market, setMarket] = useState('');
  const [require, setRequire] = useState(false);
  const [ready, setReady] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [sum, setSum] = useState(null);


  useEffect(() => {
    fetchStuff();    
  }, []);

  const fetchStuff = async () => {
    setLoading(true);
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
      setLoading(false);
    } else {
      setLoading(false);
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
  const handleChangeMarket = (event) => {
    setMarket(event.target.value);
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
              market: market,
              require: require,
              ready: !ready
            });
            
            let updItem = {
              name: name,
              amount: amount,
              price: price,
              market: market,
              require: require,
              ready: !ready
            }
            await updateDoc(docRef, updItem);
            setReady(!ready);
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
          await updateDoc(docRef, {
            name: name,
            amount: amount,
            price: price,
            market: market,
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
        market: market,
        require: require
      };
      (async () => {   
        try {
          await addDoc(collection(db, 'stuff'), newItem);
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
    setMarket('');
    setRequire(false);
  };

  const selectItem = (item) => {
    console.log(item);
    
    setSelectedItem(item);
    setName(item.name);
    setAmount(item.amount);
    setPrice(item.price);
    setMarket(item.market);
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

      <div className="stuff_header">
        <div className="left">
          <h3 className="page_title">Stuff</h3>
          <Button variant="primary" onClick={handleShow}>
            add new Item
          </Button>
        </div>
        <div className="right">
          <p>total</p>
          <Badge className="total" bg="primary" pill>{ sum }</Badge>
        </div>
      </div>

    {loading &&
      <div className="page_loader">
        <Spinner animation="grow" variant="primary" className="spinner" />
      </div>
    }
    
    {!loading &&
      <ListGroup as="ol" numbered className="list">
        {stuff.map((item, index) => (   
          <ListGroup.Item
            key={index} 
            onClick={() => selectItem(item)} 
            as="li"
            className={item.ready ? 'list_item ready' : 'list_item'}
          >
            <div className="content">
              <div className="content_top">
                <div className="ms-2 me-auto name">
                  <div className="fw-bold">{ item.name }</div>
                </div>

                <div className="nums">
                  <Badge className="data" bg="warning" pill>{ item.amount }</Badge>
                  <Badge className="data" bg="primary" pill>{ item.price }</Badge>
                  <Badge className="total" bg="primary" pill>{ item.amount * item.price }</Badge>
                </div>
              </div>

              <div className="content_bot">
                <div className="ms-2 me-auto market">
                  <div>{ item.market }</div>
                </div>
              </div>
            </div>

          </ListGroup.Item>
        ))}
      </ListGroup>
    }

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

            <FloatingLabel controlId="market" label="market">
              <Form.Control disabled={ready} value={market} type="text" placeholder="" onChange={handleChangeMarket} />
            </FloatingLabel>

            <Form.Check
              disabled={ready}
              type="switch"
              checked={require}
              id="require"
              label="require"
              onChange={handleChangeRequire} 
            />
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
