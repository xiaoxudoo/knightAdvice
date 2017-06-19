<template>
  <div class="item-view" v-if="item">
    <template v-if="item">
      <div class="item-view-header">
        <h1>{{ item.title }}</h1>
        <p class="meta">
          {{ item.time | timeAgo }} ago
        </p>
      </div>
      <div class="item-view-comments">
        <div class="item-view-comments-header">
          <spinner v-if="loading" :show="loading"></spinner>
           <div v-else>
              <button  @click="onEditorClick">编辑</button>&nbsp;
              <button  @click="onSavingClick">保存</button>
           </div>
        </div>
        <div v-if="!loading" class="comment-children">
          <h2>Content :</h2>
          <p v-show="!editoral">{{item.content}}</p>
          <textarea v-show="editoral" id="editor" class="content" cols="50" rows="10"></textarea>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import Spinner from '../components/Spinner.vue'

export default {
  name: 'item-view',
  components: { Spinner },

  data: () => ({
    loading: true,
    editoral: false
  }),

  computed: {
    item () {
      console.log(this.$store.state.items[this.$route.params.id])
      return this.$store.state.items[this.$route.params.id]
    }
  },

  // We only fetch the item itself before entering the view, because
  // it might take a long time to load threads with hundreds of comments
  // due to how the HN Firebase API works.
  asyncData ({ store, route: { params: { id }}}) {
    return store.dispatch('FETCH_ITEMS', { ids: [id] })
  },

  title () {
    return this.item.title
  },
  mounted() {
    setTimeout(()=>{
      this.loading = false
    }, 1000)
  },
  methods: {
    onEditorClick: function() {
      var _this = this
      this.editoral = true
      this.$nextTick(function() {
        $("#editor").wysibb({
          buttons: "bold,italic,underline,|,img,code"     
        })
        $("#editor").htmlcode(_this.item.content);
      })
    },
    onSavingClick: function () {
      if(!this.editoral) {
        alert('please make some change first...')
        return
      }
      var _this = this
      let params = {
        id: _this.$route.params.id,
        title: _this.item.title,
        content: $("#editor").bbcode()  // _this.content
      }
      if($("#editor").bbcode() == null) {
        alert('blank title or content')
        return;
      }
      if(confirm('sure to submit???')) {
        this.$store.dispatch('SAVE_FORM', params).then(()=>{
          this.$router.push('/')
        })
      }
    }
  }
}
</script>

<style lang="stylus">
.item-view-header
  background-color #fff
  padding 1.8em 2em 1em
  box-shadow 0 1px 2px rgba(0,0,0,.1)
  h1
    display inline
    font-size 1.5em
    margin 0
    margin-right .5em
  .host, .meta, .meta a
    color #828282
  .meta a
    text-decoration underline

.item-view-comments
  background-color #fff
  margin-top 10px
  padding 0 2em .5em

.item-view-comments-header
  margin 0
  font-size 1.1em
  padding 1em 0
  position relative
  height: 1.1em
  .spinner
    display inline-block
    margin -15px 0

.comment-children
  list-style-type none
  padding 0
  margin 0

@media (max-width 600px)
  .item-view-header
    h1
      font-size 1.25em
</style>
