<template>
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
        <button class="btn btn-primary" v-on:click='showDetail(log)'>Show Detail</button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'backlog',
  props: ['backlog'],
  methods: {
    showDetail: function (log) {
      let data = [log, 'backlog']
      this.$emit('showdetail', data)
    }
  }
}
</script>

<style>

</style>
