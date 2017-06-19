<template>
  <li class="news-item">
    <span class="score"></span>
    <span class="title">
      <template>
        <router-link :to="'/item/' + item.id">{{ item.title }}</router-link>
      </template>
    </span>
    <br>
    <span class="meta">
      <span class="time">
        {{ item.time | timeAgo }} ago
      </span>
    </span>
  </li>
</template>

<script>
import { timeAgo } from '../util/filters'

export default {
  name: 'news-item',
  props: ['item'],
  //http://ssr.vuejs.org/en/caching.html#component-level-caching
  serverCacheKey: ({ item: { id, __lastUpdated, time }}) => {
    return `${id}::${__lastUpdated}::${timeAgo(time)}`
  }
}
</script>

<style lang="stylus">
.news-item
  background-color #fff
  padding 20px 30px 20px 80px
  border-bottom 1px solid #eee
  position relative
  line-height 20px
  .score
    display inline
    position: absolute
    top 20%
    left 20px
    width 48px
    height 48px
    border-radius: 50%
    background: url('../../public/logo-48.png') no-repeat center center
  .title
    font-size 1.2em
    a
      color #828282
      &:hover
        text-decoration underline
        color #ff6600
  .meta, .host
    font-size .85em
    color #828282
    a
      color #828282
      text-decoration underline
      &:hover
        color #ff6600
</style>
