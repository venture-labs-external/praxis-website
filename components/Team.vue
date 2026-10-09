<template>
  <section id="team" class="team mx-auto">
    <h2 class="text-h1">
      {{ $t('homepage.team') }}
    </h2>
    <div class="team__members">
      <div v-for="member in team" :key="member.id">
        <div class="team__member">
          <div class="team__member-image">
            <img
              :src="`/team/${member.photo}`"
              :alt="member.name"
              loading="lazy"
            />
          </div>
          <div class="team__member-title">
            <span class="text-body-2">{{ member.name }}</span>
            <p class="text-body-1">{{ member.title }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Team.vue',
  data() {
    return {
      team: [
        {
          id: 1,
          name: 'Britta Kirrwald',
          title: 'MFA',
          photo: 'placeholder1.png',
        },
        {
          id: 2,
          name: 'Petra Quick-Zimmer',
          title: 'MFA',
          photo: 'placeholder2.png',
        },
        {
          id: 3,
          name: 'Nicole Kühn',
          title: 'MFA',
          photo: 'placeholder3.png',
        },
        {
          id: 4,
          name: 'Vera Weichhardt',
          title: 'MFA',
          photo: 'placeholder4.png',
        },
        {
          id: 5,
          name: 'Silvia Link',
          title: 'MFA',
          photo: 'placeholder5.png',
        },
      ],
    };
  },
};
</script>

<style scoped lang="scss">
.team {
  max-width: 58.75rem;
  & h2 {
    margin: $space-md 0;
  }
  &__members {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 217px));
    justify-content: center;
    gap: $space-sm !important;
  }
  &__member {
    &-image {
      img {
        width: 217px;
        max-height: 234.51px;
        object-fit: cover;
      }
    }
    &-title {
      // Both keep their real `text-body-2`/`text-body-1` classes (see
      // AboutUs.vue's identical comment). Family/size/letter-spacing here
      // are byte-identical to what Vuetify's own class already gives, so
      // only the two properties this component actually changes - the
      // span's weight and line-height - are set, with the class repeated in
      // the selector to beat `main.scss`'s equal-specificity `@media
      // md-and-up` override deterministically.
      & span.text-body-2 {
        font-style: normal;
        font-weight: $type-member-name-weight !important;
        line-height: $type-member-name-line-height !important;
      }
      & p {
        color: rgb(var(--v-theme-dark-green));
        margin-bottom: 0 !important;
      }
    }
  }
}
</style>
