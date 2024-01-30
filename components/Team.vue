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
          name: 'Kathrin Hahnefeld',
          title: 'MFA',
          photo: 'placeholder1.png',
        },
        {
          id: 2,
          name: 'Petra Quick-Zimmer',
          title: 'MFA',
          photo: 'placeholder1.png',
        },
        {
          id: 3,
          name: 'Nicole Kühn',
          title: 'MFA',
          photo: 'placeholder1.png',
        },
        {
          id: 4,
          name: 'Vera Weichhardt',
          title: 'MFA',
          photo: 'placeholder1.png',
        },
        {
          id: 5,
          name: 'Silvia Link',
          title: 'MFA',
          photo: 'placeholder1.png',
        },
        {
          id: 6,
          name: 'Kathrin Hahnefeld',
          title: 'MFA',
          photo: 'placeholder1.png',
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
    margin: 2rem 0;
  }
  &__members {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 200px));
    justify-content: center;
    gap: 1.5rem !important;
  }
  &__member {
    &-image {
      img {
        width: 100%;
        object-fit: cover;
      }
    }
    &-title {
      & span {
        font-family: Roboto;
        font-size: 20px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
      }
      & p {
        color: var(--v-dark-green-base);
        font-family: Roboto;
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: 1.4;
        margin-bottom: 0 !important;
      }
    }
  }
}
</style>
