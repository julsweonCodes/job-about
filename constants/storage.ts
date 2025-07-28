//Supabase Storage URL

const base_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/job-about`;

export const STORAGE_URLS = {
    BIZ_LOC: {
        PHOTO: base_url + "/biz-loc-photo/"
    },

    COMMON: {

    },

    QUIZ: {

    },

    USER: {
        PROFILE_IMG: base_url + "/user-photo/"
    }

}