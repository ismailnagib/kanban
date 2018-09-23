<template>
  <div class="home row mx-auto">
    <div class="col-12 mt-2 mb-4">
      <button id='newTaskBtn' class="btn btn-primary" v-on:click='newTaskModal()'>+ New Task</button>
    </div>
    <div class="col-12 col-md-6 col-xl-3">
      <div id='backlogHead' class="row bg-info colHead mx-auto">
        <h4 class="my-2 ml-4">Back-Log</h4>
      </div>
      <div class="card mx-auto">
        <div class="card-body border" v-for='(log, index) in backlog' :key='index'>
          <h5 class="card-title"><strong>{{ log.title }}</strong></h5>
          <table class="table card-text text-left ml-2">
            <tbody>
              <tr>
                <th scope="row">Point</th>
                <td>{{ log.point }}</td>
              </tr>
              <tr>
                <th scope="row">Assigned To</th>
                <td>{{ log.assignedTo }}</td>
              </tr>
            </tbody>
          </table>
          <button class="btn btn-primary" v-on:click='showDetail(log,"backlog")'>Show Detail</button>
        </div>
      </div>
    </div>
    <div class="col-12 col-md-6 col-xl-3">
      <div id='todoHead' class="row bg-warning colHead mx-auto">
        <h4 class="my-2 ml-4">To-Do</h4>
      </div>
      <div class="card mx-auto">
        <div class="card-body border" v-for='(log, index) in todo' :key='index'>
          <h5 class="card-title"><strong>{{ log.title }}</strong></h5>
          <table class="table card-text text-left ml-2">
            <tbody>
              <tr>
                <th scope="row">Point</th>
                <td>{{ log.point }}</td>
              </tr>
              <tr>
                <th scope="row">Assigned To</th>
                <td>{{ log.assignedTo }}</td>
              </tr>
            </tbody>
          </table>
          <button class="btn btn-primary" v-on:click='showDetail(log, "todo")'>Show Detail</button>
        </div>
      </div>
    </div>
    <div class="col-12 col-md-6 col-xl-3">
      <div id='doingHead' class="row bg-primary colHead mx-auto">
        <h4 class="my-2 ml-4">Doing</h4>
      </div>
      <div class="card mx-auto">
        <div class="card-body border" v-for='(log, index) in doing' :key='index'>
          <h5 class="card-title"><strong>{{ log.title }}</strong></h5>
          <table class="table card-text text-left ml-2">
            <tbody>
              <tr>
                <th scope="row">Point</th>
                <td>{{ log.point }}</td>
              </tr>
              <tr>
                <th scope="row">Assigned To</th>
                <td>{{ log.assignedTo }}</td>
              </tr>
            </tbody>
          </table>
          <button class="btn btn-primary" v-on:click='showDetail(log, "doing")'>Show Detail</button>
        </div>
      </div>
    </div>
    <div class="col-12 col-md-6 col-xl-3">
      <div id='doneHead' class="row bg-success colHead mx-auto">
        <h4 class="my-2 ml-4">Done</h4>
      </div>
      <div class="card mx-auto">
        <div class="card-body border" v-for='(log, index) in done' :key='index'>
          <h5 class="card-title"><strong>{{ log.title }}</strong></h5>
          <table class="table card-text text-left ml-2">
            <tbody>
              <tr>
                <th scope="row">Point</th>
                <td>{{ log.point }}</td>
              </tr>
              <tr>
                <th scope="row">Assigned To</th>
                <td>{{ log.assignedTo }}</td>
              </tr>
            </tbody>
          </table>
          <button class="btn btn-primary" v-on:click='showDetail(log, "done")'>Show Detail</button>
        </div>
      </div>
    </div>

    <!-- MODALS -->
    <div id='backdrop' v-if='showBackdrop'></div>

    <div v-if='openNTM'>
      <div id='newTask'>
        <button class='closeModal float-right mr-2 mt-2' v-on:click="newTaskModal()">X</button>
        <h5 class="mt-4 border-bottom pb-4"><strong>+ New Task</strong></h5>
        <div id='newTaskInput'>
          <input v-model='newtitle' type="text" placeholder="Title"><br><br>
          <textarea rows=2 v-model='newdesc' placeholder="Short description"></textarea><br><br>
          <input v-model="newpoint" type="text" placeholder="Point"><br><br>
          <input v-model="newassign" type="text" placeholder="Assigned To"><br><br>
        </div>
        <h6 v-if='noblank' class='alert alert-danger'>You must not leave any field blank</h6>
        <h6 v-else-if='pointguard' class='alert alert-danger'>Point must be a number</h6>
        <h6 v-else class="placeholder alert alert-white">.</h6>
        <button class='btn btn-danger mx-2 mt-4' v-on:click="newTaskModal()">Cancel</button>
        <button class='btn btn-success mx-2 mt-4' v-on:click="newTask()">Add Task</button><br>
      </div>
    </div>

    <div v-if='openDetail'>
      <div id='detail'>
        <div class="card">
          <div class="card-body">
            <h5 class="card-title"><strong>{{ detailed.title }}</strong></h5>
            <table class="table card-text text-left ml-2">
              <tbody>
                <tr>
                  <th scope="row">Desc</th>
                  <td>{{ detailed.desc }}</td>
                </tr>
                <tr>
                  <th scope="row">Point</th>
                  <td>{{ detailed.point }}</td>
                </tr>
                <tr>
                  <th scope="row">Assigned To</th>
                  <td>{{ detailed.assignedTo }}</td>
                </tr>
              </tbody>
            </table>
            <button class="btn btn-info" v-on:click='moveTask("backlog")' v-if='detailed.from === "todo"'>Back-Log</button>
            <button class="btn btn-warning" v-on:click='moveTask("todo")' v-else-if='detailed.from === "doing"'>To-Do</button>
            <button class="btn btn-primary" v-on:click='moveTask("doing")' v-else-if='detailed.from === "done"'>Doing</button>
            <button class="btn btn-danger" v-on:click='deleteTask()'>Delete</button>
            <button class="btn btn-warning" v-on:click='moveTask("todo")' v-if='detailed.from === "backlog"'>To-Do</button>
            <button class="btn btn-primary" v-on:click='moveTask("doing")' v-if='detailed.from === "todo"'>Doing</button>
            <button class="btn btn-success" v-on:click='moveTask("done")' v-else-if='detailed.from === "doing"'>Done</button>
            <br><button class="btn btn-danger mt-4" v-on:click='showDetail()'>Close Detail</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import db from '../../config.js'

export default {
  name: 'home',
  data: function () {
    return {
      backlog: [],
      todo: [],
      doing: [],
      done: [],
      newtitle: '',
      newdesc: '',
      newpoint: '',
      newassign: '',
      pointguard: false,
      noblank: false,
      showBackdrop: false,
      openNTM: false,
      openDetail: false,
      detailed: {}
    }
  },
  methods: {
    getAll: function () {
      this.getBacklog()
      this.getTodo()
      this.getDoing()
      this.getDone()
    },
    getBacklog: function () {
      this.backlog = []
      db.ref('backlog').once('value')
        .then((snapshot) => {
          let objkey = Object.keys(snapshot.val())
          for (var i = 0; i < objkey.length; i++) {
            this.backlog.push(snapshot.val()[objkey[i]])
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getTodo: function () {
      this.todo = []
      db.ref('todo').once('value')
        .then((snapshot) => {
          let objkey = Object.keys(snapshot.val())
          for (var i = 0; i < objkey.length; i++) {
            this.todo.push(snapshot.val()[objkey[i]])
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getDoing: function () {
      this.doing = []
      db.ref('doing').once('value')
        .then((snapshot) => {
          let objkey = Object.keys(snapshot.val())
          for (var i = 0; i < objkey.length; i++) {
            this.doing.push(snapshot.val()[objkey[i]])
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getDone: function () {
      this.done = []
      db.ref('done').once('value')
        .then((snapshot) => {
          let objkey = Object.keys(snapshot.val())
          for (var i = 0; i < objkey.length; i++) {
            this.done.push(snapshot.val()[objkey[i]])
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    moveTask: function (dest) {
      db.ref(`${this.detailed.from}/${this.detailed.key}`).remove()
      db.ref(`${dest}/${this.detailed.key}`).set({
        assignedTo: this.detailed.assignedTo,
        desc: this.detailed.desc,
        key: this.detailed.key,
        point: this.detailed.point,
        title: this.detailed.title
      })
      this.showDetail()
      this.getAll()
    },
    newTaskModal: function () {
      if (this.openNTM) {
        this.openNTM = false
        this.showBackdrop = false
        this.newtitle = ''
        this.newdesc = ''
        this.newpoint = ''
        this.newassign = ''
        this.pointguard = false
      } else {
        this.openNTM = true
        this.showBackdrop = true
      }
    },
    newTask: function () {
      if (this.newtitle.length === 0 || this.newdesc.length === 0 || this.newpoint.length === 0 || this.newassign.length === 0) {
        this.pointguard = false
        this.noblank = true
      } else if (Number(this.newpoint) + 0 !== Number(this.newpoint)) {
        this.pointguard = true
        this.noblank = false
      } else {
        this.noblank = false
        this.pointguard = false
        db.ref('backlog/').push({
          title: this.newtitle,
          desc: this.newdesc,
          point: this.newpoint,
          assignedTo: this.newassign
        })
          .then(snapshot => {
            db.ref(`backlog/${snapshot.key}`).update({
              key: snapshot.key
            })
            this.getBacklog()
          })
          .catch(err => {
            console.log(err)
          })
        this.newTaskModal()
      }
    },
    showDetail: function (log, from) {
      if (log) {
        this.detailed = log
        this.detailed.from = from
        this.showBackdrop = true
        this.openDetail = true
      } else {
        this.showBackdrop = false
        this.openDetail = false
      }
    }
  },
  created () {
    this.getAll()
  }
}
</script>

<style>
  .home {
    width: 90%;
  }
  button:focus {
    outline: none;
  }
  #newTaskBtn {
    width: 100%;
  }
  .colHead {
    color: white;
    font-family: 'Poppins', sans-serif;
    width: 99%;
  }
  .colHead .card {
    width: 99%;
  }
  .placeholder {
    color: white;
  }
  #backdrop {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: rgba(51,51,51,0.8);
    z-index: 2000;
  }
  .closeModal {
    border: none;
    background-color: white;
    font-size: 15px;
    cursor: pointer;
  }
  #newTask {
    position: fixed;
    background-color: white;
    left: 37.5%;
    top: 19%;
    width: 25%;
    height: 62%;
    z-index: 2001;
  }
  #newTaskInput textarea {
    width: 90%;
    margin-top: 1%;
    padding: 10px 15px;
    font-size: 16px;
  }
  #newTaskInput input {
    width: 90%;
    margin-top: 1%;
    font-size: 20px;
    padding: 10px;
  }
  #detail {
    position: fixed;
    background-color: white;
    left: 37.5%;
    width: 25%;
    height: 25%;
    z-index: 2001;
  }
  #detail button {
    width: 25%;
    margin: 0px 4%;
    height: 10%;
  }
</style>
