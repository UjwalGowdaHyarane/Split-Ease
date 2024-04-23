// import { upload } from "@testing-library/user-event/dist/upload";
import { useState, useEffect } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(function () {
    const getFriends = localStorage.getItem("friends");
    return JSON.parse(getFriends);
  });
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend((curr) => !curr);
  }

  function handleNewFriend(newFriend) {
    setFriends((friends) => [...friends, newFriend]);
    localStorage.setItem("friends", JSON.stringify([...friends, newFriend]));
    setShowAddFriend((show) => !show);
  }

  function handleDeletion(friendDeleted) {
    setFriends((friends) =>
      friends.filter((friend) => friend != friendDeleted)
    );
    setShowAddFriend((show) => !show);
    setSelectedFriend(null);
  }

  useEffect(
    function () {
      localStorage.setItem("friends", JSON.stringify(friends));
    },
    [friends]
  );

  function handleSelection(friend) {
    // setSelectedFriend(friend);
    selectedFriend === friend
      ? setSelectedFriend(null)
      : setSelectedFriend(friend);
    setShowAddFriend(false);
  }

  function handleSplit(value) {
    console.log("splitting");
    const updatedList = friends.map((friend) =>
      friend.id === selectedFriend.id
        ? { ...friend, balance: friend.balance + value }
        : friend
    );
    console.log(updatedList);
    setFriends(updatedList);
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friendsList={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
          onDeletion={handleDeletion}
        />
        {showAddFriend && <FormAddFriend onAddFriend={handleNewFriend} />}
        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "close" : "AddFriend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          friend={selectedFriend}
          onSplit={handleSplit}
          key={selectedFriend.id}
        />
      )}
    </div>
  );
}

function FriendsList({ friendsList, onSelection, selectedFriend, onDeletion }) {
  const friends = friendsList;
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          onSelection={onSelection}
          onDeletion={onDeletion}
          key={friend.id}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend, onDeletion }) {
  const isSelected = selectedFriend === friend;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <div className="buttonsContainer">
        <Button onClick={() => onSelection(friend)} key={friend.id}>
          {isSelected ? "Close" : "Select"}
        </Button>
        <Button onClick={() => onDeletion(friend)}>Delete</Button>
      </div>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();
    const id = crypto.randomUUID();
    const newFriend = {
      name,
      image: `${image}?=${id}`,
      balance: 0,
      id,
    };
    onAddFriend(newFriend);
    setName("");
    setImage("");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🙍🏻‍♂️🙍🏻‍♀️Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>✨Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormSplitBill({ friend, onSplit }) {
  const [bill, setBill] = useState("");
  const [userExpense, setUserExpense] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  const FriendExpense = bill ? bill - userExpense : "";

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !userExpense) return;
    console.log("Submitted");
    const value = whoIsPaying === "user" ? FriendExpense : -FriendExpense;
    onSplit(value);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {friend.name}</h2>
      <label>💶Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(e.target.value)}
      />
      <label>🙍🏻‍♂️Your expense</label>
      <input
        type="text"
        value={userExpense}
        onChange={(e) =>
          setUserExpense(
            Number(e.target.value) > bill ? userExpense : Number(e.target.value)
          )
        }
      />

      <label>🙍🏻‍♀️🙍🏻‍♂️{`${friend.name}'s expense`}</label>
      <input type="text" value={FriendExpense} disabled />
      <label>🤑Who is paying the bill?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{friend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
