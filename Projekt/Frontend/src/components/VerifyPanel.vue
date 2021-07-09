
<script>
import axios from 'axios'
export default {
  name: "VerifyPanel",
  mounted() {
    axios
        .get(`http://localhost:3000/auth/verify/${this.$route.params.id}` )
        .then(() => {
          this.$router.push('/login')
        })
        .catch(() => this.$router.push('/login'))
  }
}
</script>