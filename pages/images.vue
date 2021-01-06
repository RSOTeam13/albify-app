<template>
  <div class="mt-5">
    <div v-if="loading" class="container">
      <b-spinner style="width: 3rem; height: 3rem;" label="Large Spinner"></b-spinner>
    </div>
    <div class="row images mt-5 pt-5 pl-5 pr-5" v-else-if="images.length > 0">
      <div v-for="(image) in images" :key="image.id" class="col-12 col-lg-6 col-xl-4 pb-4">
        <b-card>
          <img :src="image.url" width="100%" height="100%" class="image-box"/>
          <b-button @click="removeImage(image.id)" class="mt-3 ml-3" size="sm">Remove</b-button>
          <b-button @click="addImageToAlbumModal(image)" class="mt-3" size="sm">Add to album</b-button>
          <b-button v-if="image.visible" @click="changeVisibility(image.id, false)" class="mt-3" size="sm">Make private</b-button>
          <b-button v-if="!image.visible" @click="changeVisibility(image.id, true)" class="mt-3" size="sm">Make public</b-button>
          <br>
          <div class="mr-3 ml-3 mt-2">
            <b-badge v-for="(tag, idx) in image.tags" :key="idx" variant="success" class="mr-1">
              {{ tag }}
            </b-badge>
          </div>
        </b-card>
      </div>
    </div>
    <div v-else class="container">
      You haven't uploaded any images yet.
    </div>

    <input type="file" ref="file" accept="image/*" style="display: none" @change="uploadImage">
    <div class="fab" @click="$refs.file.click()">
      +
    </div>

    <b-modal
      id="modal-add-image-album"
      ref="modal"
      title="Add image to album"
      centered
      scrollable
      hide-footer
    >

      <div v-if="selectedImageAlbums.length > 0" class="row">
        <div v-for="album in selectedImageAlbums" :key="album.id" class="col-12 pb-2 select-album">
          <b-card @click="addImageToAlbum(album.id)">
            {{ album.name }}
          </b-card>
        </div>
      </div>
      <div v-else>
        You can't add this image to any album.
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      images: [],
      albums: [],
      selectedImage: {},
      selectedImageAlbums: [],
      loading: false,
    }
  },
  async mounted () {
    await this.getImages()
    await this.getAlbums()
  },
  methods: {
    async getImages() {
      this.loading = true
      try {
        const res = await this.$axios.get('/image-service/v1/images')
        this.images = res.data
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    async getAlbums() {
      try {
        const res = await this.$axios.get('/album-service/v1/albums')
        this.albums = res.data
      } catch (error) {
        console.log(error)
      }
    },
    async removeImage(id) {
      try {
        const res = await this.$axios.delete(`/image-service/v1/images/${id}`)
        this.images = this.images.filter((i) => i.id !== id)

        this.$bvToast.toast('Image was removed successfully!', {
          title: 'Success',
          toaster: 'b-toaster-bottom-right',
          variant: 'success',
          solid: true,
        })
      } catch (error) {
        console.log(error)

        this.$bvToast.toast('There was an error while removing the iamge.', {
          title: 'Error',
          toaster: 'b-toaster-bottom-right',
          variant: 'danger',
          solid: true,
        })
      }      
    },
    async addImageToAlbumModal(image) {
      this.selectedImageAlbums = []
      this.selectedImage = image

      for (const album of this.albums) {
        const includesImage = !!album.images.find((i) => i == image.id)
        if (!includesImage) {
          this.selectedImageAlbums.push(album)
        }
      }

      this.$bvModal.show('modal-add-image-album')
    },
    async addImageToAlbum(albumId) {
      try {
        const res = await this.$axios.put(`/album-service/v1/albums/${albumId}/images`, {
          id: this.selectedImage.id
        })

        this.$bvModal.hide('modal-add-image-album')
        await this.getAlbums()

        this.$bvToast.toast('Image was successfully added to the album!', {
          title: 'Success',
          toaster: 'b-toaster-bottom-right',
          variant: 'success',
          solid: true,
        })
      } catch (error) {
        console.log(error)

        this.$bvToast.toast('There was an error while adding image to the album.', {
          title: 'Error',
          toaster: 'b-toaster-bottom-right',
          variant: 'danger',
          solid: true,
        })
      }
    },
    async changeVisibility(imageId, visible) {
       try {
        const res = await this.$axios.put(`/image-service/v1/images/${imageId}/visibility?visible=${visible}`)
        await this.getImages()

        this.$bvToast.toast('Image visibility was successfully updated!', {
          title: 'Success',
          toaster: 'b-toaster-bottom-right',
          variant: 'success',
          solid: true,
        })
      } catch (error) {
        console.log(error)

        this.$bvToast.toast('There was an error while updating image visibility.', {
          title: 'Error',
          toaster: 'b-toaster-bottom-right',
          variant: 'danger',
          solid: true,
        })
      }
    },
    async uploadImage(event) {
      const file = event.target.files && event.target.files[0] ? event.target.files[0] : null;
      const extension = file.name.slice(file.name.lastIndexOf('.') + 1);

      console.log(file.type)
      console.log(file.mimeType)
      try {
        const res = await this.$axios.post('/upload-image-service/v1/upload',  file, {
          headers: {
            'Content-Type': 'application/octet-stream',     
          },
        });
        await this.getImages()
        this.$bvToast.toast('Image was successfully uploaded!', {
          title: 'Success',
          toaster: 'b-toaster-bottom-right',
          variant: 'success',
          solid: true,
        })
        
      } catch (error) {
        console.log(error)

        this.$bvToast.toast('There was an error while uploading image.', {
          title: 'Error',
          toaster: 'b-toaster-bottom-right',
          variant: 'danger',
          solid: true,
        })
      }
    },
  }
}
</script>

<style scoped>
.images {
  background: #f6f6f6;
}

.select-album {
  cursor: pointer;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 150px;
}

.fab {
  z-index: 900;
	position: fixed;
	width: 4rem;
	height: 4rem;
	bottom: 2.3rem;
	right: 2.3rem;
	background-color: #a745c4;
	color: white;
	border-radius: 50px;
	text-align: center;
  box-shadow: 2px 2px 3px #999;
  font-size: 50px;
  cursor: pointer;
}

.images .card-body {
  padding-top: 0;
  padding-left: 0;
  padding-right: 0;
}
</style>
