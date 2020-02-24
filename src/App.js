import React from "react";
import axios from "axios";
// import logo from "./logo.svg";
import "./styles/styles.css";
import "./App.css";

class App extends React.Component {
  state = {
    items: [],
    name: ""
  };

  componentDidMount() {
    axios
      .get(`${process.env.REACT_APP_API_URL}/items`)
      .then(res => {
        res.data.reverse();
        this.setState({ items: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  }
  updateName = e => {
    this.setState({ name: e.target.value });
  };

  addItem = e => {
    e.preventDefault();
    axios
      .post(`${process.env.REACT_APP_API_URL}/items`, { name: this.state.name })
      .then(res => {
        let newArray = this.state.items;
        newArray.unshift(res.data);
        this.setState({ items: newArray, name: "" });
      });
  };

  toggleDone = id => {
    let isDone;
    let newArray;

    //loop through the original array
    this.state.items.map((item, i) => {
      if (item._id === id) {
        isDone = this.state.items[i].done;
        console.log(isDone);
        newArray = this.state.items;
        console.log(newArray);
        newArray[i].done = !this.state.items[i].done;
      }
    });
    axios
      .patch(`${process.env.REACT_APP_API_URL}/items/${id}`, { done: !isDone })
      .then(res => {
        this.setState({ items: newArray });
      });
  };

  deleteItem = id => {
    axios.delete(`${process.env.REACT_APP_API_URL}/items/${id}`).then(res => {
      let newArray = this.state.items.filter((e, i) => {
        return e._id !== id;
      });
      this.setState({ items: newArray });
    });
  };

  render() {
    return (
      <>
        <div className="layout">
          <h1>ToDo List.</h1>
          <div className="list">
            <form>
              <input
                type="text"
                placeholder="Add Item..."
                onChange={this.updateName}
                value={this.state.name}
              />
              <button onClick={this.addItem}>
                <i className="fas fa-plus"></i>
              </button>
            </form>
            <ul>
              {this.state.items.map((item, index) => (
                <li
                  key={item._id}
                  className={this.state.items[index].done ? "done" : ""}
                >
                  <span onClick={e => this.toggleDone(item._id)}>
                    {item.name}
                  </span>
                  <i
                    className="fas fa-minus-circle"
                    onClick={e => this.deleteItem(item._id)}
                  ></i>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </>
    );
  }
}

export default App;
