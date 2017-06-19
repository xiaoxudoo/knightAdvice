<template>
  <div class="form-view">
    <h1>欢迎吐槽骑士团</h1>
    <h2>Title :</h2>
    <input type="text" class="title" v-model.trim="title" placeholder="please enter title">
    <br/>
    <h2>Content :</h2>
    <textarea id="editor" class="content" cols="50" rows="10" v-model.trim="content"></textarea>
    <br/><br/>
    <input type="button" class="button" value="提交" @click="addAdvice">
  </div>
</template>

<script>

export default {
  name: 'form-view',
  data () {
    return {
      title: null,
      content: null,
    }
  },
  mounted: function() {
    $(function() {
      $("#editor").wysibb({
        buttons: "bold,italic,underline,|,img,code"     
      }
      );
    })
  },
  methods: {
    addAdvice: function() {
      var _this = this
      let params = {
        title: _this.title,
        content: $("#editor").bbcode()  // _this.content
      }
      if(this.title == null || $("#editor").bbcode() == null) {
        alert('blank title or content')
        return;
      }
      if(confirm('sure to submit???')) {
        this.$store.dispatch('POST_FORM', params).then(()=>{
          this.$router.push('/')
        })
      }
    }
  },
  title () {
    return 'Form'
  }
}
</script>

<style lang="stylus">
.form-view
  background-color #fff
  box-sizing border-box
  padding 2em 3em
  h1
    margin 0
    font-size 1.5em
  .title
    height 2em
    width 18em
    background-color #eee
    border-radius 6px
    padding-left 10px
  .content
    width 50em
    height 20em
    background-color #fff
    border-radius 6px
    padding 6px
    font-size 0.8em
    font-family 'MicroSoft Yahei'
  .button
    height 2em
    width 5em
    font-size 1em
    font-family 'MicroSoft Yahei'
    border-radius 3px
    background-color: #eee
    cursor pointer
    &:active
      background-color: #fff
</style>
