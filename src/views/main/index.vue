<template>
  <div class="main-container">
    <el-container>
      <el-header class="header">
        <div class="navbar">
          <!-- Logo区域 -->
          <div class="navbar-brand" @click="jump('/home')">
            <div class="logo">
              <i class="el-icon-cpu"></i>
              <span class="brand-text">zzcoder</span>
            </div>
          </div>

          <!-- 导航菜单 -->
          <el-menu router :default-active="$route.path" mode="horizontal" class="navbar-menu"
            background-color="transparent" text-color="#606266" active-text-color="#409EFF">
            <el-menu-item index="/home" class="nav-item">
              <i class="el-icon-house"></i>
              <span>首页</span>
            </el-menu-item>
            <el-menu-item index="/problem" class="nav-item">
              <i class="el-icon-collection"></i>
              <span>题库</span>
            </el-menu-item>
            <el-menu-item index="/problem-set" class="nav-item">
              <i class="el-icon-notebook-2"></i>
              <span>题单</span>
            </el-menu-item>
            <el-menu-item index="/contest" class="nav-item">
              <i class="el-icon-trophy"></i>
              <span>竞赛</span>
            </el-menu-item>
          </el-menu>

          <!-- 用户区域 -->
          <div class="navbar-user">
            <div v-if="isLogin" class="user-profile">
              <el-dropdown @command="handleUserCommand" trigger="hover" placement="bottom-end">
                <div class="user-info">
                  <el-avatar :src="userInfo.avatarUrl" :size="32" class="user-avatar">
                    <i class="el-icon-user-solid"></i>
                  </el-avatar>
                  <span class="username">{{ userInfo.username }}</span>
                  <i class="el-icon-arrow-down user-dropdown-icon"></i>
                </div>
                <el-dropdown-menu slot="dropdown" class="user-dropdown">
                  <el-dropdown-item command="profile">
                    <i class="el-icon-user"></i>
                    个人主页
                  </el-dropdown-item>
                  <!-- <el-dropdown-item command="settings">
                    <i class="el-icon-setting"></i>
                    设置
                  </el-dropdown-item> -->
                  <el-dropdown-item command="logout">
                    <i class="el-icon-switch-button"></i>
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>

            <div v-else class="auth-buttons">
              <el-button type="text" @click="jump('/auth')" class="auth-btn login-btn">
                登录
              </el-button>
              <el-button type="primary" @click="jump('/auth')" class="auth-btn register-btn" size="small">
                注册
              </el-button>
            </div>
          </div>
        </div>
      </el-header>
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { removeToken } from '@/utils/cookie'
import { logout } from '@/api/auth'
import { mapActions, mapMutations, mapState } from "vuex";

export default {
  name: 'MainPage',
  data() {
    return {
      isScrolled: false
    }
  },
  computed: {
    ...mapState('user', ['userInfo', 'isLogin'])
  },
  created() {
    if (this.isLogin) {
      this.getUserInfo() // 用户信息
    }
  },
  mounted() {
    this.addScrollListener();
  },
  beforeDestroy() {
    this.removeScrollListener();
  },
  methods: {
    ...mapActions('user', ['getUserInfo']),
    ...mapMutations('user', ['clearUserInfo', 'setLogin']),
    jump(url) {
      if (this.$route.path !== url) {
        this.$router.replace(url);
      }
    },
    async logout() {
      await logout();
      removeToken();
      this.setLogin(false);
      this.clearUserInfo()
      this.$message.success('退出成功');
    },
    handleUserCommand(command) {
      switch (command) {
        case 'profile':
          this.jump('/user');
          break;
        case 'settings':
          this.jump('/user/settings');
          break;
        case 'logout':
          this.logout();
          break;
      }
    },
    addScrollListener() {
      window.addEventListener('scroll', this.handleScroll);
    },
    removeScrollListener() {
      window.removeEventListener('scroll', this.handleScroll);
    },
    handleScroll() {
      this.isScrolled = window.scrollY > 10;
      const header = document.querySelector('.header');
      if (header) {
        if (this.isScrolled) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    }
  }
}
</script>
<style scoped>
.main-container {
  min-height: 100vh;
}

/* 导航栏样式 */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  overflow: hidden;
}

/* Logo区域样式 */
.navbar-brand {
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  z-index: 10;
}

.navbar-brand:hover {
  transform: scale(1.05);
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo i {
  font-size: 1.8rem;
  color: #409EFF;
  transition: all 0.3s ease;
}

.brand-text {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(45deg, #409EFF, #67C23A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
}

.navbar-brand:hover .logo i {
  transform: rotate(360deg);
}

/* 导航菜单样式 */
.navbar-menu {
  flex: 1;
  max-width: 600px;
  margin: 0 20px;
  border-bottom: none;
  min-width: 0;
}

.navbar-menu>>>.el-menu-item {
  height: 60px;
  line-height: 60px;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
  margin: 0 8px;
  border-radius: 8px 8px 0 0;
  position: relative;
  overflow: hidden;
}

.navbar-menu>>>.el-menu-item:hover {
  background-color: rgba(64, 158, 255, 0.1);
  color: #409EFF;
}

.navbar-menu>>>.el-menu-item.is-active {
  background-color: rgba(64, 158, 255, 0.15);
  border-bottom-color: #409EFF;
  color: #409EFF;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}

.nav-item i {
  font-size: 1.1rem;
}

/* 用户区域样式 */
.navbar-user {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  z-index: 10;
}

/* 已登录用户样式 */
.user-profile {
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(64, 158, 255, 0.1);
  border: 1px solid rgba(64, 158, 255, 0.2);
}

.user-info:hover {
  background: rgba(64, 158, 255, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
}

.user-avatar {
  border: 2px solid #409EFF;
  transition: all 0.3s ease;
}

.username {
  font-weight: 500;
  color: #409EFF;
  font-size: 0.9rem;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-dropdown-icon {
  font-size: 0.8rem;
  color: #409EFF;
  transition: transform 0.3s ease;
}

.user-info:hover .user-dropdown-icon {
  transform: rotate(180deg);
}

/* 下拉菜单样式 */
.user-dropdown>>>.el-dropdown-menu {
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border: 1px solid #e4e7ed;
  margin-top: 8px;
  min-width: 140px;
  max-width: 200px;
}

.user-dropdown>>>.el-dropdown-menu__item {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  white-space: nowrap;
  font-size: 0.9rem;
}

.user-dropdown>>>.el-dropdown-menu__item:hover {
  background-color: #f8f9ff;
  color: #409EFF;
}

.user-dropdown>>>.el-dropdown-menu__item i {
  font-size: 1rem;
  width: 16px;
  text-align: center;
}

/* 未登录按钮样式 */
.auth-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
}

.auth-btn {
  font-weight: 500;
  transition: all 0.3s ease;
  border-radius: 20px;
}

.login-btn {
  color: #606266;
  padding: 8px 16px;
}

.login-btn:hover {
  color: #409EFF;
  background-color: rgba(64, 158, 255, 0.1);
}

.register-btn {
  padding: 8px 20px;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.register-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
}

/* 主内容区域 */
.main {
  padding-top: 60px;
  min-height: calc(100vh - 60px);
  background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .navbar {
    padding: 0 12px;
  }

  .navbar-menu {
    margin: 0 8px;
    min-width: 0;
    flex: 1;
  }

  .navbar-menu>>>.el-menu-item {
    margin: 0 2px;
    font-size: 0.9rem;
    padding: 0 8px;
  }

  .nav-item span {
    display: none;
  }

  .nav-item i {
    font-size: 1.2rem;
  }

  .brand-text {
    font-size: 1.2rem;
  }

  .username {
    display: none;
  }

  .user-dropdown-icon {
    display: none;
  }

  .user-info {
    padding: 6px 8px;
    min-width: 32px;
  }

  .auth-buttons {
    gap: 6px;
  }

  .auth-btn {
    font-size: 0.85rem;
    padding: 6px 12px;
  }

  /* 确保下拉菜单在移动端不溢出 */
  .user-dropdown>>>.el-dropdown-menu {
    right: 0;
    left: auto;
    transform: translateX(0);
  }
}

@media (max-width: 480px) {
  .navbar {
    padding: 0 8px;
  }

  .navbar-menu {
    margin: 0 4px;
    flex: 1;
    min-width: 0;
  }

  .navbar-menu>>>.el-menu-item {
    margin: 0 1px;
    padding: 0 6px;
    font-size: 0.8rem;
  }

  .logo i {
    font-size: 1.5rem;
  }

  .brand-text {
    font-size: 1rem;
  }

  .auth-btn {
    font-size: 0.8rem;
    padding: 4px 8px;
  }

  .register-btn {
    padding: 4px 12px;
  }

  /* 超小屏幕上的下拉菜单优化 */
  .user-dropdown>>>.el-dropdown-menu {
    min-width: 120px;
    right: -10px;
  }

  .user-dropdown>>>.el-dropdown-menu__item {
    padding: 10px 12px;
    font-size: 0.85rem;
  }
}

/* 动画效果 */
@keyframes slideInDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.header {
  animation: slideInDown 0.6s ease forwards;
}

/* 滚动时导航栏效果 */
.header.scrolled {
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
</style>
