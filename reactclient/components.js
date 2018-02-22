let Grid = React.createClass({
  componentDidMount() {
    // loads all the contacts from server and sets them into the contacts array
    fetch("/api/contacts")
        .then(response => response.json())
        .then(contactsArray => {
            this.setState({
              contacts: contactsArray
            });
          }
        )
    },

    getInitialState: function() {
      /**
       * possible values for appState property
       * 'displayGrid' - to render the grid
       * 'add' - to render add form
       * 'edit' - to render edit form
       */
      return {
          appState: 'displayGrid',
          contacts: []
      }
    },

    showAddForm: function() {
      return (
        <div className='add-form'>
          Add a Contact
          <div>Name:<input type='text' name='name' onChange={this.onInputChange}/></div>
          <div>Phone:<input type='text' name='phone'  onChange={this.onInputChange} /></div>
          <div><button onClick={this.addNewContact}>Save</button></div>
        </div>
      );
    },

    showEditForm: function() {
      return (
        <div className='edit-form'>
          <span>Edit Contact</span>
          <div>Name:<input type='text' name='name' value={this.state.name} onChange={this.onInputChange}/></div>
          <div>Phone:<input type='text' name='phone' value={this.state.phone}   onChange={this.onInputChange} /></div>
          <div><button onClick={this.editContactServer}>Update</button></div>
        </div>
      );
    },

    showGrid: function() {
       return (
         <div>
           <div className='grid-container'>
             <div className='grid-header'>
               <div>Name</div>
               <div>Phone</div>
               <div>Edit</div>
               <div>Delete</div>
             </div>
             {this.state.contacts.map(this.renderEachContact)}
           </div>
           <div>
              <button onClick={this.onAddContactBtnClick}>Add New Contact</button>
           </div>
         </div>
        );
    },

    addNewContact: function() {
      let contact = {};
      let url = '/api/contact';
      let _me = this;

      contact.name = this.state.name;
      contact.phone = this.state.phone;
      contact.lastSpokenDate = this.state.date;

      return fetch(url, _getFetchOptions(JSON.stringify(contact), 'POST'))
      .then(function(response) {
        if (response.status != 200) {
            console.log('problem encountered while adding contact');
            return;
        } else {
          response.json().then(function(newRecord) {
            let contacts = _me.state.contacts;
                contacts.push(newRecord);
            _me.setState({
              name: '',
              phone: '',
              date: '',
              appState: 'displayGrid'
            });
            _me.setState({contacts: contacts});
          });
        }
      })
  },

  onDeleteBtnClick: function (evt) {
    let input = evt.target;
    let name = input.name;
    let contacts = this.state.contacts;
    let contactToDelete;
    let url = `/api/contact/${name}`;

    contacts = contacts.filter(function(contact) {
      if (contact._id !== name) {
        return contact;
      } else {
        contactToDelete = contact;
      }
    })

    // updates the state with filtered contacts
    this.setState({
      contacts: contacts
    });

    if (contactToDelete) {
      return fetch(url, _getFetchOptions(JSON.stringify(contactToDelete), 'DELETE'))
      .then(function(response) {
        if (response.status != 200) {
            console.log('problem encountered while deleting a contact');
            return;
        } else {
          response.json().then(function(deletedRecord) {
            console.log(deletedRecord);
          });
        }
      })
    }
  },

  onEditBtnClick: function(evt) {
    var input = evt.target;
    var name = input.name;
    let contacts = this.state.contacts;
    let contactToUpdate;
    let url = `/api/contact/${name}`;

    contacts.filter(function(contact) {
        if (contact._id == name) {
          contactToUpdate = contact;
        }
    })

    this.setState({
      appState: 'edit',
      name: contactToUpdate.name,
      phone: contactToUpdate.phone,
      date: contactToUpdate.date,
      _id: contactToUpdate._id,
      editContact: contactToUpdate,
    });
  },

  editContactServer: function() {
    let contactToUpdate = {};
    let url = `/api/contact/${this.state._id}`;
    let _me = this;

    contactToUpdate.name = this.state.name;
    contactToUpdate.phone = this.state.phone;
    contactToUpdate.date = this.state.date;
    contactToUpdate._id = this.state._id;

    if (contactToUpdate) {
      return fetch(url, _getFetchOptions(JSON.stringify(contactToUpdate), 'PUT'))
      .then(function(response) {
        if (response.status != 200) {
            console.log('problem encountered while updating contact');
            return;
        } else {
          response.json().then(function(updatedRecord) {
            _me.setState({
              appState: 'displayGrid',
            });

            // reloads contacts into grid
            fetch("/api/contacts")
              .then(response => response.json())
              .then(contactsArray => {
                  _me.setState({
                    contacts: contactsArray
                  });
                }
              )
          });
        }
      })
    }
  },

  /**
   * Invoked when the values in any of the input elements change during
   * add or edit operation
   */
  onInputChange: function(evt) {
    let input = evt.target;
    let name = input.name;

    if (name === 'name') {
      this.setState({
        name: input.value
      });
    } else if (name === 'phone') {
      this.setState({
        phone: input.value
      });
    } else if (name === 'date') {
      this.setState({
        date: input.value
      });
    }
  },

  onAddContactBtnClick: function() {
    this.setState({
      appState: 'add'
    });
  },

  renderEachContact: function(contactObj, index) {
     return (
       <Contact name={contactObj.name} phone={contactObj.phone} key={index} _id={contactObj._id} onDeleteBtnClick={this.onDeleteBtnClick} onEditBtnClick={this.onEditBtnClick}/>
     );
  },

  // grid render
  render: function() {
    if (this.state.appState === 'displayGrid') {
      return this.showGrid();
    } else if(this.state.appState === 'edit') {
      return this.showEditForm();
    } else {
      return this.showAddForm();
    }
  }
});

let Contact = React.createClass({
  render: function() {
    return (
      <div className='grid-row'>
        <div>{this.props.name}</div>
        <div>{this.props.phone}</div>
        <div><button name={this.props._id} onClick = {this.props.onEditBtnClick}>Edit</button></div>
        <div><button name={this.props._id} onClick = {this.props.onDeleteBtnClick}>Delete</button></div>
      </div>
    );
  }
});

ReactDOM.render(<Grid />, document.getElementById('grid-container'));

/**
 * Util to generate options for the fetch call
 */
function _getFetchOptions(body, method) {
  return {
    body: body || '',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'user-agent': navigator.userAgent,
      'content-type': 'application/json'
    },
    method: method || 'GET',
    redirect: 'follow',
    referrer: 'no-referrer',
  }
}
