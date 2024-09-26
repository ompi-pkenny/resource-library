<template>
  <div>
    <h1 class="resource-library-header">Resource Library</h1>
    <div>
      <div class="filters">
        <div class="filter-row">
          <div class="date-filter filter">
            <label>Sort by Revision Date:</label>
            <select v-model="sortOrder">
              <option value="asc">Oldest First</option>
              <option value="desc">Newest First</option>
            </select>
          </div>
          <div class="search-filter filter">
            <label>Search:</label>
            <input type="text" v-model="searchQuery">
          </div>
        </div>
        <div class="filter-row">
          <div class="dropdown-menus filter" v-for="menu in menus" :key="menu.name">
            <button class="dropdown-button" @click="toggleDropdown(menu)">{{ menu.name }}</button>
            <ul class="dropdown-menu" v-if="menu.isOpen">
              <li v-for="option in menu.options" :key="option">
                <label>
                  <input type="checkbox" :value="option[1]" v-model="menu.selected">{{ option[0] }}
                </label>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="catalog">
        <div class="side-filters">
          <div class="side-filter" v-for="menu in menus" :key="menu.name">
            <ul>
              <h2>{{ menu.name }}</h2>
              <li v-for="option in menu.options" :key="option">
                <label>
                  <input type="checkbox" :value="option[1]" v-model="menu.selected">{{ option[0] }}
                </label>
              </li>
            </ul>
          </div>
        </div>
        <div class="resources-container">
          <div class="pagination">
            <button @click="changePage(currentPage - 1)" :disabled="currentPage <= 1">Previous</button>
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
            <button @click="changePage(currentPage + 1)" :disabled="currentPage >= totalPages">Next</button>
          </div>
          <!-- <div v-if="loading" class="lds-loader">
            <div class="lds-roller">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div> -->
          <div ref="masonryContainer" class="resources masonry-grid">
            <div :class="generateClassNames(resource.resource_types[0], resource.clinical_programs[0])"
              class="resource masonry-item" v-for="resource in resources" :key="resource.id">
              <img @load="onImageOrPdfRendered" class="resource-img" v-if="resource.featured_image_url"
                :src="resource.featured_image_url" />
              <img @load="onImageOrPdfRendered" class="resource-img" v-else src='Frame 2.jpg' />

              <div class="overlay">

                <div style="color: white;" v-if="resource.isLocked">
                  <img src="images/locked.svg" height="75px" />
                  <p>Members Only</p>
                </div>
                <div v-else-if="resource.resource_types.includes(22)">
                  <div style="display: flex; flex-direction: column; height: 100%;" id="myDropdown"
                    class="dropdown-content">
                    <div v-if="resource.acf.blog_post" class="presentation-toolkit-resource">
                      <div>Blog Post</div>
                      <div class="presentation-toolkit-links">
                        <a  :href="resource.acf.blog_post"><img src="images/view.svg" alt=""></a>
                        <a  download="" :href="resource.acf.blog_post"><img src="images/download.svg" alt=""></a>
                      </div>
                    </div>
                    <div v-if="resource.acf.email_content" class="presentation-toolkit-resource">
                      <div>Email Content</div>
                      <div class="presentation-toolkit-links">
                        <a  :href="resource.acf.email_content"><img src="images/view.svg" alt=""></a>
                        <a  download="" :href="resource.acf.email_content"><img src="images/download.svg" alt=""></a>
                      </div>
                    </div>
                    <div v-if="resource.acf.social_media_content" class="presentation-toolkit-resource">
                      <div>Social Media Content</div>
                      <div class="presentation-toolkit-links">
                        <a  :href="resource.acf.social_media_content"><img src="images/view.svg" alt=""></a>
                        <a  download="" :href="resource.acf.social_media_content"><img src="images/download.svg" alt=""></a>
                      </div>
                    </div>
                    <div v-if="resource.acf.social_media_images" class="presentation-toolkit-resource">
                      <div>Social Media Images</div>
                      <div class="presentation-toolkit-links">
                        <a  download="" :href="resource.acf.social_media_images"><img src="images/download.svg" alt=""></a>
                      </div>
                    </div>
                    <div v-if="resource.acf.webinar_slide_deck" class="presentation-toolkit-resource">
                      <div>Webinar Slide Deck</div>
                      <div class="presentation-toolkit-links">
                        <a  download="" :href="resource.acf.webinar_slide_deck"><img src="images/download.svg" alt=""></a>
                      </div>
                    </div>
                    <div  v-if="resource.acf.email_sequence" class="presentation-toolkit-resource">
                      <div>Email Sequence</div>
                      <div class="presentation-toolkit-links">
                        <a :href="resource.acf.email_sequence"><img src="images/view.svg" alt=""></a>
                        <a download="" :href="resource.acf.email_sequence"><img src="images/download.svg" alt=""></a>
                      </div>
                    </div>
                    <div v-if="resource.acf.powerpoint_narration_" class="presentation-toolkit-resource">
                      <div>Power Point Narration</div>
                      <div class="presentation-toolkit-links">
                        <span :class="`wistia_embed wistia_async_${resource.acf.powerpoint_narration_wistia_id} popover=true popoverContent=link videoFoam=false`" style="display:inline;position:relative"><img style="cursor: pointer;" src="images/view.svg" alt=""></span>
                        <a download="" :href="resource.acf.powerpoint_narration_"><img src="images/download.svg" alt=""></a>
                      </div>
                    </div>
                    <div v-if="resource.acf.post_webinar_scripts" class="presentation-toolkit-resource">
                      <div>Post Webinar Scripts</div>
                      <div class="presentation-toolkit-links">
                        <a  :href="resource.acf.post_webinar_scripts"><img src="images/view.svg" alt=""></a>
                        <a  download="" :href="resource.acf.post_webinar_scripts"><img src="images/download.svg" alt=""></a>
                      </div>
                    </div>
                    <div v-if="resource.acf.all_resources" class="presentation-toolkit-resource">
                      <div>All Resources</div>
                      <div class="presentation-toolkit-links">
                        <a  download="" :href="resource.acf.all_resources"><img src="images/download.svg" alt=""></a>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <a class="resource-btn view" v-if="resource.acf.content_link"
                    :href="resource.acf.content_link">View</a>
                  <a class="resource-btn view" :download="resource.title.rendered" v-if="resource.acf.download_url"
                    :href="resource.acf.download_url">Download</a>
                </div>
              </div>
              <div class="resource-title">{{ resource.title.rendered }}</div>
              <div class="resource-taxonomies">
                <div class="resource-clinical-program" v-for="program in resource.clinical_programs" :key="program">{{
                  getClinicalProgramName(program)
                }}</div>
                <div class="resource-resource-type" v-for="type in resource.resource_types" :key="type">{{
                  getResourceTypeName(type) }}</div>
              </div>
            </div>
          </div>
          <div class="pagination">
            <button @click="changePage(currentPage - 1)" :disabled="currentPage <= 1">Previous</button>
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
            <button @click="changePage(currentPage + 1)" :disabled="currentPage >= totalPages">Next</button>
          </div>
        </div>
      </div>
    </div>
  </div>



</template>

<script>
import axios from 'axios';
import { debounce } from 'lodash';
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';






export default {
  name: 'ResourceLibrary',
  components: {



  },

  data() {
    return {
      membership: [],
      membershipTest: ["PRO", "GVT-GI", "CP-WELL"],
      resources: [],
      menus: [
        { name: "Resource Types", isOpen: false, selected: [], options: [] },
        { name: "Clinical Programs", isOpen: false, selected: [], options: [] }
      ],
      sortOrder: 'asc',
      searchQuery: '',
      debouncedSearchQuery: '',
      currentPage: 1,
      totalPages: 1,
      itemsPerPage: 12,
      loading: false,
      masonryInstance: null,
      loadedResources: 0,
    };
  },
  watch: {
    resources() {
      console.log("research watch")
      this.loadedResources = 0;
      imagesLoaded('.resource-img', { background: true }, () => {

        this.masonryInstance.layout();
        console.log("images loaded")
      });
    },
    searchQuery: debounce(function (newQuery) {
      this.debouncedSearchQuery = newQuery;
    }, 300),
    debouncedSearchQuery() {
      this.fetchResources(1);
    },
    sortOrder() {
      this.fetchResources(1);
    },
    menus: {
      handler() {
        this.fetchResources(1);
      },
      deep: true
    }
  },
  methods: {

    appendWistiaScript (wistiaId) {
      const script = document.createElement('script');
      script.src = `https://fast.wistia.com/embed/medias/${wistiaId}.jsonp`;
      script.async = true;
      document.body.appendChild(script);
    },
    onImageOrPdfRendered() {
      console.log("image or pdf rendered")
      this.loadedResources += 1;


      // Once all images/PDFs have rendered, initialize the Masonry layout


      this.masonryInstance.reloadItems();
      this.masonryInstance.layout();


    },
    initializeMasonry() {
      this.masonryInstance = new Masonry(this.$refs.masonryContainer, {
        itemSelector: '.masonry-item',
        columnWidth: '.masonry-item', // Adjust according to your column width
        percentPosition: true,

      });
      // Wait for images to load before laying out the masonry grid
      imagesLoaded('.resource-img', { background: true }, () => {
        console.log("images loaded")
        this.masonryInstance.layout();
      });
      window.addEventListener('resize', () => {
        console.log("resize")
        this.masonryInstance.layout();
      });
    },
    getResourceTypeName(typeId) {
      const type = this.menus[0].options.find(option => option[1] === typeId);
      return type ? type[0] : 'Unknown Type';
    },
    getClinicalProgramName(programId) {
      const type = this.menus[1].options.find(option => option[1] === programId);
      return type ? type[0] : 'Unknown Type';
    },

    toggleDropdown(menu) {
      menu.isOpen = !menu.isOpen;
    },
    generateClassNames(resourceTypeId, clinicalProgramId) {
      // Convert the texts to valid class names (e.g., replace spaces with hyphens, make it lowercase)
      // Return the concatenated class names
      return `resource-type-${resourceTypeId} clinical-program-${clinicalProgramId}`;
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    buildFilterParams() {
      let params = {
        order: this.sortOrder,
        search: this.debouncedSearchQuery,
        page: this.currentPage,
        per_page: this.itemsPerPage
      };
      this.menus.forEach(menu => {
        if (menu.selected.length > 0) {
          const filterKey = menu.name.toLowerCase().replace(' ', '_');
          params[filterKey] = menu.selected.join(',');
        }
      });
      return params;
    },
    getCacheKey(params) {
      return `resources_${JSON.stringify(params)}`;
    },
    async fetchMembershipLevel() {
      try {
        const response = await axios.get('https://staging4.lmrcimplementation.com/wp-json/myplugin/v1/session');
        this.membership = response.data.user_levels;
        console.log(this.membership, "membership level")
      } catch (error) {
        console.error('Error fetching membership levels:', error);
      }
    },
    async fetchResources(page = 1) {
      this.loading = true; // Set loading to true
      this.currentPage = page;
      const params = this.buildFilterParams();
      const cacheKey = this.getCacheKey(params);

      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        const cachedObject = JSON.parse(cachedData);
        const now = new Date().getTime();
        if (now - cachedObject.timestamp < 3600000) { // Cache for 1 hour
          this.resources = cachedObject.data.resources;
          this.totalPages = cachedObject.data.totalPages;
          this.loading = false; // Set loading to false
          return;
        }
      }

      try {

        const response = await axios.get('https://staging4.lmrcimplementation.com/wp-json/wp/v2/resources/', { params });
        const resources = await Promise.all(response.data.map(async (resource) => {
          const membershipLevel = this.membershipTest;
          const resourceMembership = resource.acf.membership_level;
          if (resourceMembership) {
            resource.isLocked = !membershipLevel.some(level => resourceMembership.includes(level));
          } else {
            resource.isLocked = false;
          }
          return resource;
        }));

        const totalPages = parseInt(response.headers['x-wp-totalpages'], 10);
        this.resources = resources;
        this.totalPages = totalPages;

        localStorage.setItem(cacheKey, JSON.stringify({
          timestamp: new Date().getTime(),
          data: { resources, totalPages }
        }));
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        this.loading = false; // Ensure loading is set to false in case of an error
      }
    },
    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.fetchResources(page);
      }
    },
    async fetchResourceTypes() {
      const cacheKey = 'resourceTypes';
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        const cachedObject = JSON.parse(cachedData);
        const now = new Date().getTime();
        if (now - cachedObject.timestamp < 3600000) { // Cache for 1 hour
          this.menus[0].options = cachedObject.data;
          console.log(this.menus)
          return;
        }
      }

      try {
        const response = await axios.get('https://staging4.lmrcimplementation.com/wp-json/wp/v2/resource_types?per_page=100');
        const options = response.data.map(type => [type.name, type.id]);
        this.menus[0].options = options;
        localStorage.setItem(cacheKey, JSON.stringify({
          timestamp: new Date().getTime(),
          data: options
        }));
      } catch (error) {
        console.error('Error fetching resource types:', error);
      }
    },
    async fetchClinicalPrograms() {
      const cacheKey = 'clinicalPrograms';
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        const cachedObject = JSON.parse(cachedData);
        const now = new Date().getTime();
        if (now - cachedObject.timestamp < 3600000) { // Cache for 1 hour
          this.menus[1].options = cachedObject.data;
          return;
        }
      }

      try {
        const response = await axios.get('https://staging4.lmrcimplementation.com/wp-json/wp/v2/clinical_programs?per_page=100');
        const options = response.data.map(category => [category.name, category.id]);

        this.menus[1].options = options;
        localStorage.setItem(cacheKey, JSON.stringify({
          timestamp: new Date().getTime(),
          data: options
        }));
      } catch (error) {
        console.error('Error fetching ClinicalPrograms:', error);
      }
    },
    async fetchInitialData() {
      try {
        await Promise.all([this.fetchMembershipLevel(), this.fetchResources(), this.fetchResourceTypes(), this.fetchClinicalPrograms(),]);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    },
  },
  mounted() {
    this.fetchInitialData();
    this.initializeMasonry();
    const wistiaScript = document.createElement('script');
    wistiaScript.src = 'https://fast.wistia.com/assets/external/E-v1.js';
    wistiaScript.async = true;
    document.body.appendChild(wistiaScript);
    

  },
  beforeUnmount() {
    if (this.masonry) {
      this.masonry.destroy();
    }
  },
};
</script>

<style scoped>
.presentation-toolkit-resource {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 100%;
  color: white;
  align-items: center;
  font-weight: bold
}

input {
  padding: .5rem;
  border-radius: 25px;
  font-size: 1rem;
}

.masonry-item {
  width: 25%;
  /* Adjust based on your preference */
  margin: 10px;
}



@media (max-width: 1199px) {
  .masonry-item {
    width: 33.33%;
    /* 3 columns */
  }
}

@media (max-width: 991px) {
  .masonry-item {
    width: 50%;
    /* 2 columns */
  }
}

@media (max-width: 767px) {
  .masonry-item {
    width: 80%;
    /* 1 column */
  }
}

.resource {
  position: relative;
}

.resource-img {
  width: 100%;
  display: block;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9));
  opacity: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  transition: opacity 0.3s ease;
  border-radius: 25px;
}

.resource:hover .overlay {
  opacity: 1;
}

.resource-btn {
  background-color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 14px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  text-decoration: none;
  color: black;
  font-weight: bold;
  text-transform: uppercase;
  margin: 5px;
}

.resource-btn:hover {
  background-color: #ccc;
  /* Change this color for a hover effect */
}

.loader {
  font-size: 1.5rem;
  text-align: center;
  margin: 2rem 0;
}



.resources-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-width: 1060px;
}

.resource {
  /* display: flex;
  align-items: center; */
  border-radius: 25px;
  background-color: #dee3e7;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  flex-direction: column;
  justify-content: start;
  margin: 1rem;
  padding: 1rem;
}

.catalog {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.dropdown-menu {
  background-color: white;
  border: 1px solid #e9ecef;
  border-radius: 3px;
  list-style-type: none;
  margin: 0;
  padding: 0;
  position: absolute;
  z-index: 1;
}

.dropdown-menu li {
  border-bottom: 1px solid #e9ecef;
  cursor: pointer;
  padding: 5px;
  text-align: left;
  transition: background-color 0.3s;
  width: 200px;
}

.dropdown-menu li:hover {
  background-color: #f8f9fa;
}

.dropdown-menu li:last-child {
  border-bottom: none;
}

.dropdown-menus {
  position: relative;
  display: none;

}

.dropdown-menus button {
  border-radius: 25px;
  background: #acd5f8;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: .5rem;
  transition: background-color 0.3s;
}

.filter {
  margin: .5rem 0;
}

.filters {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-around;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.lds-roller {
  /* change color here */
  color: #1c4c5b
}

.lds-roller,
.lds-roller div,
.lds-roller div:after {
  box-sizing: border-box;
}

.lds-roller {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}

.lds-roller div {
  animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  transform-origin: 40px 40px;
}

.lds-roller div:after {
  content: " ";
  display: block;
  position: absolute;
  width: 7.2px;
  height: 7.2px;
  border-radius: 50%;
  background: currentColor;
  margin: -3.6px 0 0 -3.6px;
}

.lds-roller div:nth-child(1) {
  animation-delay: -0.036s;
}

.lds-roller div:nth-child(1):after {
  top: 62.62742px;
  left: 62.62742px;
}

.lds-roller div:nth-child(2) {
  animation-delay: -0.072s;
}

.lds-roller div:nth-child(2):after {
  top: 67.71281px;
  left: 56px;
}

.lds-roller div:nth-child(3) {
  animation-delay: -0.108s;
}

.lds-roller div:nth-child(3):after {
  top: 70.90963px;
  left: 48.28221px;
}

.lds-roller div:nth-child(4) {
  animation-delay: -0.144s;
}

.lds-roller div:nth-child(4):after {
  top: 72px;
  left: 40px;
}

.lds-roller div:nth-child(5) {
  animation-delay: -0.18s;
}

.lds-roller div:nth-child(5):after {
  top: 70.90963px;
  left: 31.71779px;
}

.lds-roller div:nth-child(6) {
  animation-delay: -0.216s;
}

.lds-roller div:nth-child(6):after {
  top: 67.71281px;
  left: 24px;
}

.lds-roller div:nth-child(7) {
  animation-delay: -0.252s;
}

.lds-roller div:nth-child(7):after {
  top: 62.62742px;
  left: 17.37258px;
}

.lds-roller div:nth-child(8) {
  animation-delay: -0.288s;
}

.lds-roller div:nth-child(8):after {
  top: 56px;
  left: 12.28719px;
}

@keyframes lds-roller {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.pagination {
  align-items: center;
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.pagination button {
  background-color: #e9ecef;
  border: none;
  cursor: pointer;
  margin: 0 0.5rem;
  padding: 0.5rem 1rem;
}

.pagination span {
  margin: 0 0.5rem;
}



/* @media (max-width: 768px) {
  .resource {
    width: calc(50% - 20px);
  }
}

@media (max-width: 480px) {
  .resource {
    width: calc(100% - 20px);
  }
} */

.resource-img {
  border-radius: 25px;
  margin-bottom: 1rem;
  width: 100%;
}

.resource-library-header {
  font-size: 2rem;
  margin: 1rem;
  text-align: center
}

.resource-links {
  display: flex;
  justify-content: end;
  width: 100%;

}

.resource-clinical-program {
  padding: .5rem;
  border-radius: 25px;
  font-size: 12px;
  background: #acd5f8;
  border: none;
  white-space: nowrap;
  margin-bottom: 5px;
  margin-right: 5px;

}

.resource-resource-type {
  padding: .5rem;
  border-radius: 25px;
  font-size: 12px;
  background: #f9fcff;
  border: none;
  white-space: nowrap;
  margin-bottom: 5px;
  margin-right: 5px;
}

.resource-taxonomies {
  display: flex;
  flex-wrap: wrap;
}

.resource-title {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

select {
  padding: .5rem;
  border-radius: 25px;
  font-size: 1rem;
  background: #acd5f8;
  border: none;
}

button {
  padding: .5rem;
  border-radius: 25px;
  font-size: 1rem;
  background: #acd5f8;
  border: none;
}



.side-filters {
  display: flex;
  flex-direction: column;
  margin: 1rem;
  margin-right: 2vw;
}

.side-filter {
  border: 1px solid #e9ecef;
  border-radius: 25px;
  margin-bottom: 1rem;
  padding: 1rem;
  width: 200px;
}

.side-filter h2 {
  margin: 0;
}

.side-filter ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  text-align: left;
}

.side-filter li {
  padding: 0.5rem;
}

/* Clinical Program Classes */

/* Cm vitals */
.clinical-program-25 .resource-clinical-program {
  background-color: #F87D82;
  color: #671A1A;
}

/* Immune Foundations */
.clinical-program-40 .resource-clinical-program {
  background-color: #B89DEB;
  color: #44247E;
}

/* MSK Solutions */
.clinical-program-35 .resource-clinical-program {
  background-color: #F67DD5;
  color: #AA007C;
}

/* Pillars of GI Health */
.clinical-program-37 .resource-clinical-program {
  background-color: #69C8F3;
  color: #03567B;
}

/* SOS Stress Recovery */
.clinical-program-38 .resource-clinical-program {
  background-color: #F2D58D;
  color: #664900;
}

/* WellMatrix Health Resiliency */
.clinical-program-40 .resource-clinical-program {
  background-color: #C7E37B;
  color: #3E5500;
}


/* Resource Type Classes */




@media (max-width: 600px) {
  .catalog-container {
    flex-direction: column;
  }

  .dropdown-menus {
    display: block;
  }


  .side-filters {
    display: none;
  }
}

.resource-img {
  border-radius: 25px;
  width: 100%;
  object-fit: cover
}
</style>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  margin-bottom: 60px;
}
</style>