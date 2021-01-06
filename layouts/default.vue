<template>
  <div id="app">
    <Slide :isOpen="this.sideMenu" disableOutsideClick noOverlay :closeOnNavigation="true" @closeMenu="handleCloseMenu">
      <nuxt-link to="/" class="mt-3">
        <i class="fa fa-folder-open fa-md pt-1 mr-2 icon-nav"></i><span>Albums</span>
      </nuxt-link>
      <nuxt-link to="/images" class="mt-3">
        <i class="fa fa-images fa-md pt-1 mr-2 icon-nav"></i><span>Images</span>
      </nuxt-link>
      <nuxt-link to="/shared" class="mt-3">
        <i class="fa fa-heart fa-md pt-1 mr-2 icon-nav"></i><span>Shared</span>
      </nuxt-link>
    </Slide>
    <b-navbar class="nav" fixed="top">
      <div style="font-size: 0.8rem;">
        <i @click="toggleSideMenu()" class="menu-icon mr-3 side-nav-ic fa fa-bars fa-lg"></i>
      </div>
      <b-navbar-brand>
        <nuxt-link to="/">
          <img src="/img/logo-dark.png" width="85" height="45" class="d-inline-block align-top" alt="logo">
        </nuxt-link>
      </b-navbar-brand>

       <b-navbar-nav v-if="user && user.firstName && user.lastName" class="ml-auto">
          <b-nav-item-dropdown right>
          <template #button-content>
            <em>{{ user.firstName }} {{ user.lastName }}</em>
          </template>
          <b-dropdown-item @click="logOut()">Log Out</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-navbar>
    <Nuxt id="page-wrap"/>
  </div>
</template>

<script>
import { Slide } from 'vue-burger-menu'

export default {
  components: {
    Slide
  },
  data () {
    return {
      sideMenu: false,
      user: null
    }
  },
  mounted() {
    this.user = !!localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
  },
  methods: {
    toggleSideMenu() {
      this.sideMenu = !this.sideMenu
    },
    handleCloseMenu() {
      this.sideMenu = false
    },
    logOut() {
      localStorage.clear()
      this.$router.replace('/login')
    }
  }
}
</script>

<style>
.nav {
  z-index: 1000;
  background-color: white;
  border-bottom: 0.5px solid #a745c4;
}

.menu-icon {
  cursor: pointer;
}

.icon-nav {
  color: white;
}



html {
  font-family:
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
