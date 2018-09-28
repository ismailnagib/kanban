<template>
  <div class="home row mx-auto">
    <div class="col-12 mt-2 mb-4">
      <button id='newTaskBtn' class="btn btn-primary" v-on:click='newTaskModal()'>+ New Task</button>
    </div>
    <backlogcomp v-bind:backlog='backlog' @showdetail='showDetail'></backlogcomp>
    <todocomp v-bind:todo='todo' @showdetail='showDetail'></todocomp>
    <doingcomp v-bind:doing='doing' @showdetail='showDetail'></doingcomp>
    <donecomp v-bind:done='done' @showdetail='showDetail'></donecomp>

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
            <button class="btn btn-info" v-on:click='movePrev()' v-if='detailed.from === "todo"'>Back-Log</button>
            <button class="btn btn-warning" v-on:click='movePrev()' v-else-if='detailed.from === "doing"'>To-Do</button>
            <button class="btn btn-primary" v-on:click='movePrev()' v-else-if='detailed.from === "done"'>Doing</button>
            <button class="btn btn-danger" v-on:click='deleteTask()'>Delete</button>
            <button class="btn btn-warning" v-on:click='moveNext()' v-if='detailed.from === "backlog"'>To-Do</button>
            <button class="btn btn-primary" v-on:click='moveNext()' v-if='detailed.from === "todo"'>Doing</button>
            <button class="btn btn-success" v-on:click='moveNext()' v-else-if='detailed.from === "doing"'>Done</button>
            <br><button class="btn btn-danger mt-4" v-on:click='showDetail()'>Close Detail</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import db from '../../config.js'
import backlogcomp from '@/components/backlog.vue'
import todocomp from '@/components/todo.vue'
import doingcomp from '@/components/doing.vue'
import donecomp from '@/components/done.vue'

export default {
  name: 'home',
  components: {
    backlogcomp,
    todocomp,
    doingcomp,
    donecomp
  },
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
      this.get0()
      this.get1()
      this.get2()
      this.get3()
    },
    get0: function () {
      this.backlog = []
      db.ref('/').once('value')
        .then((snapshot) => {
          let objkey = Object.keys(snapshot.val())
          for (var i = 0; i < objkey.length; i++) {
            if (snapshot.val()[objkey[i]].status === 0) {
              this.backlog.push(snapshot.val()[objkey[i]])
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    get1: function () {
      this.todo = []
      db.ref('/').once('value')
        .then((snapshot) => {
          let objkey = Object.keys(snapshot.val())
          for (var i = 0; i < objkey.length; i++) {
            if (snapshot.val()[objkey[i]].status === 1) {
              this.todo.push(snapshot.val()[objkey[i]])
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    get2: function () {
      this.doing = []
      db.ref('/').once('value')
        .then((snapshot) => {
          let objkey = Object.keys(snapshot.val())
          for (var i = 0; i < objkey.length; i++) {
            if (snapshot.val()[objkey[i]].status === 2) {
              this.doing.push(snapshot.val()[objkey[i]])
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    get3: function () {
      this.done = []
      db.ref('/').once('value')
        .then((snapshot) => {
          let objkey = Object.keys(snapshot.val())
          for (var i = 0; i < objkey.length; i++) {
            if (snapshot.val()[objkey[i]].status === 3) {
              this.done.push(snapshot.val()[objkey[i]])
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    movePrev: function (dest) {
      db.ref(`${this.detailed.key}`).update({
        status: this.detailed.status - 1
      })
      this.showDetail()
      this[`get${this.detailed.status}`]()
      this[`get${this.detailed.status - 1}`]()
    },
    moveNext: function (dest) {
      db.ref(`${this.detailed.key}`).update({
        status: this.detailed.status + 1
      })
      this.showDetail()
      this[`get${this.detailed.status}`]()
      this[`get${this.detailed.status + 1}`]()
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
        db.ref('/').push({
          title: this.newtitle,
          desc: this.newdesc,
          point: this.newpoint,
          assignedTo: this.newassign,
          status: 0
        })
          .then(snapshot => {
            db.ref(`${snapshot.key}`).update({
              key: snapshot.key
            })
            this.get0()
          })
          .catch(err => {
            console.log(err)
          })
        this.newTaskModal()
      }
    },
    showDetail: function (value) {
      if (value) {
        this.detailed = value[0]
        this.detailed.from = value[1]
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
