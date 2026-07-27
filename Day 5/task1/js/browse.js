/**
 * Netflix Clone - Browse page interactions
 */

const MOVIE_ROWS = [
  {
    title: "Dark TV Sci-Fi & Fantasy",
    type: "standard",
    items: [
      { title: "Human Vapor", poster: "https://occ-0-2590-3647.1.nflxso.net/dnm/api/v6/0Qzqdxw-HG1AiOKLWWPsFOUDA2E/AAAABRhZDdcoJnye7FUZbz6SVP5Gi_YfeOdfHuf9dQNhlVZENotBBLMrSQ1M5V44Kv8bsyxc4zwXH5pHsW16frJhMWGfp9TQ1PTLi5UBsXuOc7gvd1BZXR8OEe2cBRswppXVr4cod3nTaw8I2cOzgpISC-R4r5cK10LiprQakVmLSgb5.webp?r=670" },
      { title: "Chilling Adventures of Sabrina", poster: "https://occ-0-2590-3647.1.nflxso.net/dnm/api/v6/0Qzqdxw-HG1AiOKLWWPsFOUDA2E/AAAABb4q5k595DrU2m5ut9qEbxS0_vhBwOfK4m1H-4LbC9Ajkv42C479Xu2uRX4mzt9Rev57LmcaFUzbVbW4U-ETU7S23CUFTHPmUBE.webp?r=15e" },
      { title: "Alice in Borderland", poster: "https://occ-0-2590-3647.1.nflxso.net/dnm/api/v6/0Qzqdxw-HG1AiOKLWWPsFOUDA2E/AAAABYrJIrPOLgW1E3C971Y6LxCHCjepYQ2qsyzPD8jTzopb-na8TVKlmGbIjDJo0ikP6UYFBgA9SCMhV0TGw6xt6l_Cg14nb4CT3TE.webp?r=bc4" },
      { title: "Titans", poster: "https://occ-0-2590-3647.1.nflxso.net/dnm/api/v6/0Qzqdxw-HG1AiOKLWWPsFOUDA2E/AAAABRPTmiCcVFoM_vLDdjvYn6WQRnuKJM0TPNZZo5Us8VPGKqg0PyrBNWqlAAelldMcjM6joafSiQ_FPMCkQrUwf3cnKRWAuaaVFj0.webp?r=718" },
      { title: "The Order", poster: "https://occ-0-2590-3647.1.nflxso.net/dnm/api/v6/0Qzqdxw-HG1AiOKLWWPsFOUDA2E/AAAABc31m_5mHFspIouGrAfO1VhrsnhtPz2uuIibiVM7uexMMSfFVYsJT7sw_zqVjBnvYrj2s0X0ogfOckcLZPDd640OWN7P-usGF1k.webp?r=8d6" },
      { title: "Fate: The Winx Saga", poster: "https://occ-0-2590-3647.1.nflxso.net/dnm/api/v6/0Qzqdxw-HG1AiOKLWWPsFOUDA2E/AAAABZivcD18uYVXgkbn1dMtd014C5mfbu8Ilo0uvKNXWehlI1bc5khBYwTEfQF3eMt7ec0BaWm-64nX7PckCrxcWDdrb9zq1kTDJH0.webp?r=18d" },
      { title: "Black Mirror", poster: "https://occ-0-2590-3647.1.nflxso.net/dnm/api/v6/0Qzqdxw-HG1AiOKLWWPsFOUDA2E/AAAABRgmxuJPwrKhMZEdDfyOLtJl79IXZRiuwa8zVHqpSjx0VZbf1MfQSjbIUHDkZDHFK_aUd9chO6vu_-JCaz6Kglbhc8wqvP2svQ8.webp?r=8d4" },
      { title: "The Rain", poster: "https://occ-0-2590-3647.1.nflxso.net/dnm/api/v6/0Qzqdxw-HG1AiOKLWWPsFOUDA2E/AAAABYxJbx0BqFytVl2ze7uc_VbtdnH4LNOkacdzuPGrLQxh9Ehq9NPk6GYt5WkMtGr6KpwMrbvKFBwdk0rEsxDlwo9DJG5rA0_rRIU.webp?r=404" },
    ],
  },
  {
    title: "Japanese Anime Series",
    type: "standard",
    items: [
      { title: "One Piece", poster: "https://occ-0-2590-3647.1.nflxso.net/dnm/api/v6/0Qzqdxw-HG1AiOKLWWPsFOUDA2E/AAAABdHaDcUj8f-8Ro6MaXDeUYeBz7N9_9v8kLMfcnt-DaCGdggwNEAvAEH6R2u8KexGtLE6KY_JuWZAQNLIUoy018b33S1vh1i9huwmxg6_Zc2NWkYTMMa10iHyPBAoTZxhZgYyNAjJVbD6p5OMGMpmJG4ykgBsW4_jDW9JlVFi6OgiSb_1jFt60wOkUcM4854UVgpbazkEbMCe76l3L3SWzbIxCWkjMstWa7W38PCFnRVsb_ztGE0SfcAIZMgUaucjHN-yB23Fwez2mzGsUc1iLQIwoMYU66KcaKQGoKDvEBjmewDgk-zB-tPIOXCj.webp?r=633" },
      { title: "Demon Slayer: Kimetsu no Yaiba", poster: "https://occ-0-2590-3647.1.nflxso.net/dnm/api/v6/0Qzqdxw-HG1AiOKLWWPsFOUDA2E/AAAABY487XiQcWhOZEseLCgyfqwH3M5ifkEQ-clWAbOyNiOYHrumjvgb1VBsm1GmofdryIh_Wf-7L9RWShuNN4g7R2VZdgK0G0beEn0.webp?r=ff8" },
      { title: "Bleach", poster: "https://occ-0-2590-3647.1.nflxso.net/dnm/api/v6/0Qzqdxw-HG1AiOKLWWPsFOUDA2E/AAAABTprrZ3NsCfuNpShhKmYTtEg8hKqM1r9Meh_Y7bKLYL2GMTvFFCWfMp5P8J9qbMX-NSagYosO9VB9IVxjXGAdTq_OSUjn8paJ4A.webp?r=100" },
      { title: "Black Clover", poster: "https://occ-0-2590-3647.1.nflxso.net/dnm/api/v6/0Qzqdxw-HG1AiOKLWWPsFOUDA2E/AAAABR0Z2OG0XfXGYI1LOeHFa0-JRG3O4dp0c0829qVvAqDn0SzWM-U0fL-JVKcVchoEo00AGyi9M8GJ2XPjP6vjDVzyUYjfvf756G0.webp?r=353" },
      { title: "Dr.STONE", poster: "https://occ-0-2590-3647.1.nflxso.net/dnm/api/v6/0Qzqdxw-HG1AiOKLWWPsFOUDA2E/AAAABRnHrSzG7RBdss0CEymJ8TjvLvX4ypWsFjlSP22PJwU8KDi4WJFLU4FX1fbZCQ0RZ_e66MgiUUUoZqyxmbNH5t1rBzkQU-6wcGQe23smqd6uUQ4tsZqlAHBryoRFZ2gr9YUVjEtqi2YXAd9liI-9CQ5t4H_fhXkDbLosyj3c0-QbnknYGbcTl9hkKnsi4zd09EicjtpDkRTu7aVzw6jm-BbFp3pKWge6QHQs4Y-V4hEQaeS-OjTYDFpg9Ef-44Y4RIalqz0Agq1-FsteucQzHmTBpzNA9fcymkok8d5ToNkMq_Wvia7Uf7rApvx9.webp?r=249" },
      { title: "Haikyu!!", poster: "https://occ-0-2590-3647.1.nflxso.net/dnm/api/v6/0Qzqdxw-HG1AiOKLWWPsFOUDA2E/AAAABRVYuR-d-5NKUQ7GUIwHoyHHLgCNRRyTPh9dq9tFlJnk-I6jMV25MODDqF05uSYIrNv4c8KJRZ83Er9IUKLOxcM0011f9RKmLmM.webp?r=fd0" },
      { title: "The Apothecary Diaries", poster: "https://occ-0-2590-3647.1.nflxso.net/dnm/api/v6/0Qzqdxw-HG1AiOKLWWPsFOUDA2E/AAAABYXQclUM0AGHv7qMcUh09YwQZkHH2BVUV1ucDQE5a37-aT_m6DxgrJXMuSmbbCcKlINv3DEOhPPAS0FSvXhtxX-n8orUt4UjKq0.webp?r=0ad" },
      { title: "Naruto", poster: "https://occ-0-2590-3647.1.nflxso.net/dnm/api/v6/0Qzqdxw-HG1AiOKLWWPsFOUDA2E/AAAABZxjiIoz2t5x3-_TbrDtN1l4Fox3SMBiGeBhRmPorgwUBAJeDTO5akEfuWhmEmvfZRp687KCzG1nYYSfHc5mkYXWa_q1_ZJO65E.webp?r=601" },
    ],
  },
  {
    title: "Top 10 Movies in India Today",
    type: "top10",
    items: [
      { title: "Pati Patni Aur Woh Do", poster: "https://occ-0-2590-3647.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABRBgaU--0wWp1JmnLL5eFFzMfGgO7iPyRgYub9pUXur2YmmGn5Q5BJVLPIXEUGnzxT53i_44XVSmAfMKJ2Wi_Zo0263TX5gsgjEtM-udkvVe2yzVuZBCO0OS6hE06eHrKI0s1PYaVnoXY84K3FwUGhUZInBj3aN6OBPTjJPhPqH1qA.webp?r=6f0" },
      { title: "Desire", poster: "https://occ-0-2590-3647.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABZrdqSfQqxM6ibW42yFT7Uzl7KG72QMpLNgoqYBh28JBGItr0yHeZK8RVF8w_gPocQgmKiba2Hj9nqq5IZNqtTjfSZj30UbEOz0vngvRfUvnIcyWEvvk4cmx84nLZckPquwXyZw2OP5yYUIk3Qu_CzKc26Vz_ZtxWWLUk5ekrlh6zg.webp?r=066" },
      { title: "Peddi", poster: "https://occ-0-2590-3647.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABSVC9fQtry6uiQ3U8Hsb8BfMK_R6H7eWZUqpUgCkITqIijToojfaCrSzBTXkc6fx8Z-1c-Ux-G1L4v_DtuyRW9X8j16phy0Ohy6G1HjmqWm5A56CPLKVeHv6fzf4_Fi4mwBPpXNAFo1ZIloobNKl07vU46qWCm_KS6N4Gr3tdrSFiQ.webp?r=fbc" },
      { title: "Sniper: No Nation", poster: "https://occ-0-2590-3647.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABXCPoAUn_zQNG0K4qp6VcRa3tfYKy2q58hLGxmZMXe5B1tNbZc9IqbE5cWnWohLgG-YVoNJmnXkE0AqSbnF0dA54jpMvKbhG2pA_G_FSPYIjwpekCaEbc_npWLfhqFomSEasY90N6A9Njjt3nXK-rvaRp128qDKiNDOWeIpdevUR1A.webp?r=f55" },
      { title: "Blast", poster: "https://occ-0-2590-3647.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABWil2FdFGpHcSviH08WSiQd9H7v3UaA9W6SViBLvApgm34SN_VCj7tYBPG6MGgAc02deoXgUkok9QPWsq-tQH246qUOlYw_vGdZVuAxMdQYIWFIltzQ-jkaxv3vJcZ5bhDTlJykoDuFhpUKYUWQieoex-heHHQA_Cd8XIkHWJmSshA.webp?r=448" },
      { title: "Daadi Ki Shaadi", poster: "https://occ-0-2590-3647.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABXlefmk1s7nfoOPvJOLUiOIX5wiy0RxtE2x0LR_6w84IpWriHArdj7oJv2DqGclyhWf7vSKlZxPF9ceoaTvgN7rLzFqszaZnj2bFn5P7z6LLB_ofIg7ONqHz1vLMafrnXo_ztr4S8iZH_oHuTLNGThnglNWxVnaidtGIGtcZGqs1Rw.webp?r=8c4" },
      { title: "Bhooth Bangla", poster: "https://occ-0-2590-3647.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABXWsOZqN6tdL126xtoMiLuK2ZvTydYnEbGKI2kEl3j3PtknB98GOzQAMO7D2vEJbJeWC9SuVDTDpWMQEtagSnsiXPuElkRcXhi5u.webp?r=08b" },
      { title: "Journey 2: The Mysterious Island", poster: "https://occ-0-2590-3647.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABROc2QkqUvg5bDy7mugDxtKdchduYo_nVp_MW8cK1KHhZV7E74zeqCalIwq476h1lTpUz4B3-h9mT8SE2qs7DaHdVS6CbDe9-B7u.webp?r=037" },
    ],
  },
  {
    title: "New on Netflix",
    type: "standard",
    items: [
      { title: "Young Sheldon", poster: "https://occ-0-2590-3647.1.nflxso.net/dnm/api/v6/0Qzqdxw-HG1AiOKLWWPsFOUDA2E/AAAABYP1WytgLWRYzd-FxcForoZHOOjCCFYvfGaHB7PH53GehuTgIEzHedIsb9BX8ixYxP9XUHIqLvJMd8ctanvK9TsRY9x_TtN40dYkvG-iqj6R9GM3RttjI_3tJsndnKLfKMROjXDHHSI_3Q18tQ04GyGfK6IdZWtXyOqiy7c.webp?r=5cd" },
      { title: "The East Palace", poster: "https://occ-0-2590-3647.1.nflxso.net/dnm/api/v6/0Qzqdxw-HG1AiOKLWWPsFOUDA2E/AAAABZn53eYBbNklwoQp5sndQ3KdlRg9abnJADYPSkX4AjyH1iZjVzXdhEObObXRuq-nOggwHl3JX5tMheq508_dVLoa6Sk3xohZ1sjBS2EdZSZUfek2GSIhe7ZhnojgFDxhtwK2sdpCFHi4GtSyHuclTeWUdO7-_gTmgOQ.webp?r=747" },
      { title: "Sniper: No Nation", poster: "https://occ-0-2590-3647.1.nflxso.net/dnm/api/v6/0Qzqdxw-HG1AiOKLWWPsFOUDA2E/AAAABZXaqGDYd_b4JzYDHz_stjBV5iDpXZ1dMGY1TvPk-gbivQ1Lnu_7N5cXMRl0EMYWW9mNv_Yn2grlh_K-OEmkbZcxeWk5zccLJeHKss1LKQEob1SRVivMU3KRBPo9gnVFGinJVHiG3bveSJwuOQTO5soFMX92_V9ztL8.webp?r=286" },
      { title: "Spooky in Love", poster: "https://occ-0-2590-3647.1.nflxso.net/dnm/api/v6/0Qzqdxw-HG1AiOKLWWPsFOUDA2E/AAAABYjC5sCX7Xym0NNYk8vIvWs46xYTg7rXZdYubSF6irN1lx5tSBv63M7JGQxnHV5qxufPEnKrys0kdvZ-mJAVa9SJ6VuRHLae-YDbeHrvVQ209NyoHqZ7PrKcX-XoxDG5MNf_5a8Q0cQTCWIFaOi57sR04qkxoMXXB9k6OSbqKGdK77hrgydDK24qsPUH1qBE3rPcb-BW3pPoPi0MvODhM-NUgPTRjlAkIxChyFlcryqk2dFJaS3hhHqpHZhKQgzvymAQzWVS-T2nLKcyVxcJghlYqgMTaAYyzkY-sBRCOfUrYWy3K8GfNcZY2idmpdDflru2vlCxoLEl-zLf5QBZ_g1p9rKDhpDW3LUYKYrq6UrTgPw_f1PJ1Ss.webp?r=44b" },
      { title: "Stokes Twins", poster: "https://occ-0-2590-3647.1.nflxso.net/dnm/api/v6/0Qzqdxw-HG1AiOKLWWPsFOUDA2E/AAAABVEVqbo_qNmn5yWVpNnBwohO5tKvbwcjt46-5g8_etzpWn0xEx0C3sYld6F48Y7Gx73wsk6gQURQeCNJy6TRdDgHwlWMiuR2UZo.webp?r=aad" },
      { title: "23 000 Lives", poster: "https://occ-0-2590-3647.1.nflxso.net/dnm/api/v6/0Qzqdxw-HG1AiOKLWWPsFOUDA2E/AAAABWBkqEvexRylG2H_EZO8l7Vqs4IuN3aApkLJ_QhFSkkHZdaR09ZuZVZLz4spG8-wIaoTpZl6cfnjqhSF9yHeIN7C1aT72MAyzJs.webp?r=a41" },
      { title: "Desire", poster: "https://occ-0-2590-3647.1.nflxso.net/dnm/api/v6/0Qzqdxw-HG1AiOKLWWPsFOUDA2E/AAAABY_Y-r8VN8n-e-vlcWIZnw-8rfunBfPA1oqyAAnjOVJzukAymCM0V5dt_dgqw-cvvqGLfIDoaEh5X7QDo2njbEef3v_ki7IGf-NrpmrTDy5K1JnOOUgFMm8oSDqDTbzLXapwHuH7BsGEqF_Bdg92GyXnVSbvjQg7nFY.webp?r=637" },
      { title: "Unexplainable", poster: "https://occ-0-2590-3647.1.nflxso.net/dnm/api/v6/0Qzqdxw-HG1AiOKLWWPsFOUDA2E/AAAABeHZgfyzbZeh53gg34n1fs_2u6nxkIa3Vu27UGYVPQlUUrBA4RB2bfGgERa9k5VIIeg_M5RyD7xXPxEBbizfoqj5iZPM7RLt6gSMzVQF2uGrcgWty1KkW464b7VIUDWcn1QWGmP15zpNeQMCqivYRLjygAMmmteKunUhDY_E7YHtgLovXbsbuHWXVtg7hhjSZi7N7FGxK2zNmVAHydV3TkYoBXRKy3NaR8Z0KONv7h8fmwMIsjSmwX_tY_GY-APt5qdR09fMpf1kbC4UeQ6fjHDmSuDRKAOTkv6D7zESzJDnJWTjElnKcdVVnPZORRKr3A4OGvCJzcox5_IJvGgM8YVwWjpoR23Ugx8gjGdQjDqX1OduMj4aDR8.webp?r=802" },
    ],
  },
  {
    title: "Top 10 TV Shows in India Today",
    type: "top10",
    items: [
      { title: "Lock Upp", poster: "https://occ-0-2590-3647.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABVG4SMrpK6imtYvAqgw_q7zydDVTHJJcDTc0zgUd61fr402qbOLpKG-Mcl2rn_xRXNAp9j8gX9WPvnT_KuA3JQ4cnmycc_-B3mgfar9_AIyQHFkXePkIANj8A8SndfOc2nkoXsjnyjOQUCbyOMOxApB5qAViJIg903aOT0z0gFziTdMf10S2XWBP_km3xK-0aFQwuc-ofniE0xgRTUZz8Xp9SIHCtOBGrIEr5zPQDxwoW4MJQKAF6JqosiZEdBejiMML64Tm4XgYAKh2xgK4sN7NkFHQrQYoQJnx1bnK4TBj-h-uSK9FzNM9Pazb9Q.webp?r=6f7" },
      { title: "The East Palace", poster: "https://occ-0-2590-3647.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABQyLvly4Etwqh67sO5--Ot-bJohFj_TFMdgIUc1OdVSaWZNDUHc31k6Ar2RwPlj0rRlYQNRN2bFjvyJEs8GHSqi-5YwcTVpHtzRyS6EjD5w_fS6MlclwyBteTZUuCYLkKK2-iMJK0U4pjBCcBSA4CasxdDgy9OIk8MUBPZLAjTBF7A.webp?r=b47" },
      { title: "Spooky in Love", poster: "https://occ-0-2590-3647.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABZv47yygyZxQ9XyLc3ICUGFJb2Y-AaKxXhNCYkag9wmnZhVenk67hI-1efJwpZNrmrU31AYTkocsqGdMSnSXtiA4infwugiu45S12s_DlbF1t6p6G0ic1cmJcgFB6Nge4a-hsM4qQdEiYiehCN_OnXKhEsTBEVmPug6C9f36_5wNFfOGAKgdAeXi1ZNiF306ni-CFaHcMAHC76vHK2ozbzMEhE_bHRmmVC91YWQgVqlL8rzlPk4CYQ5t3EYq5EYRScf9B2a5YIxqSivoiTTObyyiU78I07hGAFn_BdYsNBTpnn1-bOVsVm83MD7Dqg.webp?r=9f5" },
      { title: "Agent Kim Reactivated", poster: "https://occ-0-2590-3647.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABdLxg7hwT9tgxA2XAVJvA8_5gfv2IbtiygdIpQaaP8QzKbhOwPD0ggsNDMVH_TTdXojH-YpVrq9HEk9MuQq11rdZEI0wU-1RKj4xNMV3NZOcCSeZ9-w-xmD4BstKcC6WQ8T-944I3CeyUT6FDiHMNG7ywt2-KQ4IiL0kYK2RCTQVKwP5P4NqHsML-re1C0uRs0o8-Vvm7bsDLsIxZQNYLeo3uHKGSmwL9Rs3d2zdGggazB8L7gXkjRn3l6eJYGRtxNgu-XNHEHPGxg4Vh1VkPtP0IX_iFKWXjdMy8agDQGjBqeJ7F31QMlBE3bynew.webp?r=46a" },
      { title: "Super Subbu", poster: "https://occ-0-2590-3647.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABQmyFMvGDG2y9vqT5vPc6qIqq41UPiyFiXwzhApA0inIWO_qN0T_WfPulzMtGfk0ajMZHWkrw4fOwcfnGCzVHqQQivdB7v44LvVRS8IpSIn6TPiRihOWRFei2ADrsA6ZJrb4SWgYj39-5rByQT7lvONmOjHmDqLxcX6JrsuTWMcq7Q.webp?r=618" },
      { title: "I Will Find You", poster: "https://occ-0-2590-3647.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABQlBvPeXVx2ta9pLkg1wRpZ96lMKX6Ocdcck6AWhgaLHxEogwl7s0aEfeDRIJ51utBtKdoVz10YnEahoS7y6e-6dn2vdMqrTa19d.webp?r=8fc" },
      { title: "Avatar: The Last Airbender", poster: "https://occ-0-2590-3647.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABbW2Q2OxDyI2VriW0NilvejxJExpELy8zYJqLKoClJoojlrFiCKfH8lgKAHKxojYt_Kzm9GjrC6F4PO3VMRTiSYlqrmd75OhoWVY.webp?r=154" },
      { title: "The Apartment Job", poster: "https://occ-0-2590-3647.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABWVIrJa9QTFn34dnOHFU5VtEd7b1K_-Ca5KEEbargdW60JUPmcYg8haMouqRgId8FWn8aQ3UZCg295bPWqvqF0u_lTKx2dHcEhNeCANjc2nxkTRuh_Wq78XevdEbVy9_47-QPx7uyqRFylpYIN4g710LV0P0rQicO7NfERqM0QDFf5mwaIcKCv0unKiPTy-WKemKMPLPlO_yYGNTT5GJOYh6yqcM2MnI69Cy-Yh2AfrqzY0uXNAfuDTfBKMky45TwIwaNdBiJeF4MlX7EnL0jVEZ0EQKP7_1d9tM3ktXT-kVnzq-NfQ3F7fym1aVFw.webp?r=963" },
    ],
  },
];

const HERO_PREVIEW_VIDEO = "";

const FEATURED = {
  title: "Smallville",
  titleLogo: "https://occ-0-4610-3647.1.nflxso.net/dnm/api/v6/S4oi7EPZbv2UEPaukW54OORa0S8/AAAABRofPVL9IK_4eBg7FRHKKHV0qD1mnwtq9cNs7ebK6kGNFjjqX7LfTZqY1EVedi8xcolWfQyUCosPS4MfD52i7rN40DqG8yO0Jerw.webp?r=bb0",
  description: "First love. Teen angst. X-ray vision. In this series based on DC Comics' Superman, a young Clark Kent tries to understand his powers — and himself.",
  backdrop: "https://occ-0-4610-3647.1.nflxso.net/dnm/api/v6/a0rzcqaxbY-vbvJ_p52ifDlKBbg/AAAABc8vSr5_jkCHNyTRBypuHEkloBP7q-ZDyhUgzSuU6F4JxLyeQNa9L1CH41VKS1mrfae6mD_rfqsUdH4PmXcCGykaSJGfoB0nYceW.webp?r=9ab",
  backdropLarge: "https://occ-0-4610-3647.1.nflxso.net/dnm/api/v6/x2x1Gn4QgTuVowyvC5vjsETMDK0/AAAABbLo3uYCc26NXfVeoLWbGQsRXOUPUoz_7YIbF0bEvG04DUBAoaFGAJsdyAwWVR9gmXPTrNTy9AJ-GJdynFjjjD9RZWRw-COus5D-umMBVLcIZ7pTW-UWcYSEaA.webp?r=99c",
  genre: "Drama",
  year: "2001",
  episodes: "10 Seasons",
  rating: "U/A 16+",
  match: "97% Match",
  cast: "Tom Welling, Kristin Kreuk, Michael Rosenbaum, more",
  genres: "US, Teen TV Shows, Sci-Fi TV",
  mood: "Exciting, Emotional",
  maturity: "violence, foul language",
  video: "",
  seasons: {
    "Season 1": [
      { num: 1, title: "Pilot", duration: "45m", synopsis: "A young Clark Kent begins to understand his extraordinary powers after a meteor shower." },
      { num: 2, title: "Metamorphosis", duration: "43m", synopsis: "Clark tries to balance first love and teen life while hiding who he really is." },
      { num: 3, title: "Hothead", duration: "43m", synopsis: "A football coach's ruthless methods put Clark's friends in danger." },
    ],
  },
};

const TITLE_DETAILS = {
  "Chilling Adventures of Sabrina": {
    titleLogo: "",
    description: "The darkest days of the void arrive as Sabrina struggles with grief and regret. Can she summon the strength to overcome an endless cycle of destruction?",
    year: "2020",
    episodes: "4 Parts",
    rating: "A",
    match: "96% Match",
    cast: "Kiernan Shipka, Ross Lynch, Miranda Otto, more",
    genres: "US, Teen TV Shows, TV Horror",
    mood: "Chilling, Dark",
    maturity: "sex, violence, gore, nudity, tobacco use",
    video: "",
    seasons: {
      "Part 4": [
        { num: 8, title: "Chapter Thirty-Six: At the Mountains of Madness", duration: "64m", synopsis: "The darkest days of the void arrive as Sabrina struggles with grief and regret." },
        { num: 7, title: "Chapter Thirty-Five: The Witching Hour", duration: "58m", synopsis: "Sabrina faces her greatest challenge yet as the void threatens everything she loves." },
        { num: 6, title: "Chapter Thirty-Four: The Returned", duration: "55m", synopsis: "Old allies return with secrets that could change the course of the war." },
      ],
    },
  },
  "Alice in Borderland": {
    description: "With his two friends, a video-game enthusiast finds himself in a parallel version of Tokyo, where he must compete in several sadistic games to survive.",
    year: "2025",
    episodes: "3 Seasons",
    rating: "A",
    match: "97% Match",
    cast: "Kento Yamazaki, Tao Tsuchiya, Nirina Zubir, more",
    genres: "Japanese, TV Thrillers, Sci-Fi TV",
    mood: "Suspenseful, Dark",
    maturity: "violence, gore, foul language",
    video: "",
    seasons: {
      "Season 3": [
        { num: 1, title: "Episode 1", duration: "52m", synopsis: "Arisu and Usagi are drawn back into the deadly games of the Borderland." },
        { num: 2, title: "Episode 2", duration: "49m", synopsis: "A new queen rises, and the stakes have never been higher." },
      ],
    },
  },
  "Black Mirror": {
    description: "This sci-fi anthology series explores a twisted, high-tech near-future where humanity's greatest innovations and darkest instincts collide.",
    year: "2025",
    episodes: "7 Seasons",
    rating: "A",
    match: "95% Match",
    cast: "Various Ensembles",
    genres: "British, TV Sci-Fi & Fantasy, Anthologies",
    mood: "Dark, Mind-Bending",
    maturity: "violence, sex, foul language",
    video: "",
    seasons: {
      "Season 7": [
        { num: 1, title: "Common People", duration: "62m", synopsis: "A couple's love is tested when medical bills force them into a disturbing subscription service." },
        { num: 2, title: "Bête Noire", duration: "48m", synopsis: "A young woman suspects her mentor is not what she seems." },
      ],
    },
  },
  "One Piece": {
    description: "Monkey D. Luffy refuses to let anyone or anything stand in the way of his quest to become the king of all pirates.",
    year: "2023",
    episodes: "1000+ Episodes",
    rating: "U/A 13+",
    match: "99% Match",
    cast: "Mayumi Tanaka, Kazuya Nakai, Akemi Okamura, more",
    genres: "Japanese, Anime Series, Action",
    mood: "Exciting, Adventurous",
    maturity: "violence, smoking",
    video: "",
    seasons: {
      "East Blue Saga": [
        { num: 1, title: "I'm Luffy! The Man Who's Gonna Be King of the Pirates!", duration: "24m", synopsis: "A young boy named Luffy sets out to become the greatest pirate in the world." },
        { num: 2, title: "Enter the Great Swordsman! Pirate Hunter Roronoa Zoro!", duration: "24m", synopsis: "Luffy recruits the skilled swordsman Zoro to join his crew." },
      ],
    },
  },
};

function getTitleDetails(title, poster) {
  const known = TITLE_DETAILS[title] || {};
  const isFeatured = title === FEATURED.title;
  return {
    title,
    poster,
    titleLogo: known.titleLogo || (isFeatured ? FEATURED.titleLogo : ""),
    backdrop: known.backdrop || poster,
    description: known.description || `Watch ${title} on Netflix. Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.`,
    year: known.year || "2025",
    episodes: known.episodes || "Limited Series",
    rating: known.rating || "U/A 16+",
    match: known.match || `${85 + (title.length % 14)}% Match`,
    cast: known.cast || "Various Artists, more",
    genres: known.genres || "Drama, Entertainment",
    mood: known.mood || "Engaging, Exciting",
    maturity: known.maturity || "violence, foul language",
    video: known.video || "",
    seasons: known.seasons || {
      "Season 1": [
        { num: 1, title: "Episode 1", duration: "45m", synopsis: `The story begins as ${title} draws you into its world.` },
        { num: 2, title: "Episode 2", duration: "44m", synopsis: "Tensions rise and alliances are tested in unexpected ways." },
        { num: 3, title: "Episode 3", duration: "46m", synopsis: "The stakes get higher as secrets from the past emerge." },
      ],
    },
  };
}

function renderStandardItem(item) {
  return `
    <button type="button" data-title="${item.title}" data-poster="${item.poster}"
            class="browse-card browse-title-trigger flex-shrink-0 w-[240px] sm:w-[280px] md:w-[320px] relative cursor-pointer group/card text-left">
      <img src="${item.poster}" alt="${item.title}" loading="lazy"
           class="w-full aspect-video object-cover rounded-sm bg-[#2f2f2f]">
      <div class="absolute inset-0 bg-black/80 opacity-0 group-hover/card:opacity-100 transition-opacity rounded-sm p-3 flex flex-col justify-end pointer-events-none">
        <p class="text-sm font-bold truncate">${item.title}</p>
      </div>
    </button>
  `;
}

function renderTop10Item(item, index) {
  const num = index + 1;
  return `
    <div class="top10-item">
      <button type="button" data-title="${item.title}" data-poster="${item.poster}"
              class="top10-btn browse-title-trigger" aria-label="${num}. ${item.title}">
        <span class="top10-number-wrap" aria-hidden="true">
          <span class="top10-number-fill">${num}</span>
          <span class="top10-number-stroke">${num}</span>
        </span>
        <span class="top10-poster-wrap">
          <span class="top10-poster" style="background-image:url('${item.poster}')" role="img" aria-label="${item.title}"></span>
        </span>
      </button>
    </div>
  `;
}

function renderRows() {
  const container = document.getElementById("movieRows");
  if (!container) return;

  container.innerHTML = MOVIE_ROWS.map((row, rowIndex) => {
    const isTop10 = row.type === "top10";
    const itemsHtml = row.items.map((item, i) =>
      isTop10 ? renderTop10Item(item, i) : renderStandardItem(item)
    ).join("");

    const scrollClass = isTop10 ? "top10-list scrollbar-hide" : "row-scroll flex gap-1 sm:gap-2 overflow-x-auto scrollbar-hide";

    return `
      <section class="relative group/row mb-6 sm:mb-8 browse-row" data-row="${rowIndex}">
        <h2 class="text-base sm:text-xl font-bold mb-2 px-4 sm:px-8 lg:px-16">${row.title}</h2>
        <div class="relative">
          <button type="button" aria-label="Scroll left"
                  class="row-scroll-left hidden sm:flex absolute left-0 top-0 bottom-0 z-10 w-12 items-center justify-center bg-black/50 opacity-0 group-hover/row:opacity-100 hover:bg-black/70 transition-opacity">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <div class="${scrollClass} px-4 sm:px-8 lg:px-16 pb-2">
            ${itemsHtml}
          </div>
          <button type="button" aria-label="Scroll right"
                  class="row-scroll-right hidden sm:flex absolute right-0 top-0 bottom-0 z-10 w-12 items-center justify-center bg-black/50 opacity-0 group-hover/row:opacity-100 hover:bg-black/70 transition-opacity">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </section>
    `;
  }).join("");

  container.querySelectorAll(".row-scroll-left").forEach((btn) => {
    btn.addEventListener("click", () => {
      const row = btn.parentElement.querySelector(".row-scroll, .top10-list");
      row?.scrollBy({ left: -600, behavior: "smooth" });
    });
  });
  container.querySelectorAll(".row-scroll-right").forEach((btn) => {
    btn.addEventListener("click", () => {
      const row = btn.parentElement.querySelector(".row-scroll, .top10-list");
      row?.scrollBy({ left: 600, behavior: "smooth" });
    });
  });

  container.querySelectorAll(".browse-title-trigger").forEach((el) => {
    el.addEventListener("click", () => {
      openDetailModal(el.dataset.title, el.dataset.poster);
    });
  });
}

function initBrowseNav() {
  const nav = document.getElementById("browseNav");
  window.addEventListener("scroll", () => {
    nav?.classList.toggle("browse-nav-scrolled", window.scrollY > 50);
  });

  const profileBtn = document.getElementById("profileBtn");
  const profileMenu = document.getElementById("profileMenu");
  profileBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    profileMenu?.classList.toggle("hidden");
  });
  document.addEventListener("click", () => profileMenu?.classList.add("hidden"));

  document.getElementById("signOutBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    NetflixAuth.logout();
  });

  document.getElementById("switchProfileBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("netflix_profile");
    window.location.href = "profiles.html";
  });

  const searchBtn = document.getElementById("searchBtn");
  const searchBox = document.getElementById("searchBox");
  searchBtn?.addEventListener("click", () => {
    searchBox?.classList.toggle("hidden");
    if (searchBox && !searchBox.classList.contains("hidden")) {
      searchBox.querySelector("input")?.focus();
    }
  });
}

function initFeatured() {
  const profile = NetflixAuth.getSelectedProfile();
  const nameEl = document.getElementById("profileName");
  if (profile && nameEl) nameEl.textContent = profile.name;

  const heroImg = document.getElementById("heroBackdropImg");
  if (heroImg) {
    heroImg.src = FEATURED.backdrop;
    heroImg.srcset = `${FEATURED.backdrop} 960w, ${FEATURED.backdropLarge} 1920w`;
  }

  const titleLogo = document.getElementById("featuredTitleLogo");
  if (titleLogo) {
    titleLogo.src = FEATURED.titleLogo;
    titleLogo.alt = FEATURED.title;
  }

  const titleText = document.getElementById("featuredTitle");
  if (titleText) titleText.textContent = FEATURED.title;

  const descEl = document.getElementById("featuredDesc");
  if (descEl) descEl.textContent = FEATURED.description;

  const genreEl = document.getElementById("featuredGenre");
  if (genreEl) genreEl.textContent = FEATURED.genre;

  const yearEl = document.getElementById("featuredYear");
  if (yearEl) yearEl.textContent = FEATURED.year;

  const episodesEl = document.getElementById("featuredEpisodes");
  if (episodesEl) episodesEl.textContent = FEATURED.episodes;

  const ratingEl = document.getElementById("featuredRating");
  if (ratingEl) ratingEl.textContent = FEATURED.rating;

  initHeroVideo();
}

const MUTE_ICON = `<path d="M7 3a.75.75 0 0 0-1.26-.55L3.04 5H.75a.75.75 0 0 0-.75.75v4.5c0 .41.34.75.75.75h2.29l2.7 2.55A.75.75 0 0 0 7 13V3zM5.7 9.7 7 8.42V11.6l-1.3-1.3-.22-.2H1.5v-4h3.41z"/>`;
const UNMUTE_ICON = `<path d="M7 3a.75.75 0 0 0-1.26-.55L3.04 5H.75a.75.75 0 0 0-.75.75v4.5c0 .41.34.75.75.75h2.29l2.7 2.55A.75.75 0 0 0 7 13V3zM11.5 4.5a.75.75 0 0 1 1.06 0 8 8 0 0 1 0 11.31.75.75 0 1 1-1.06-1.06 6.5 6.5 0 0 0 0-9.19.75.75 0 0 1 0-1.06zM14.53 2.47a.75.75 0 0 1 1.06 0 11 11 0 0 1 0 15.56.75.75 0 1 1-1.06-1.06 9.5 9.5 0 0 0 0-13.44.75.75 0 0 1 0-1.06z"/>`;

function setupVideoPlayback({ video, img, muteBtn, muteIcon, src, shouldPlay }) {
  if (!video) return;

  if (!src) {
    video.pause();
    video.removeAttribute("src");
    video.load();
    video.classList.remove("is-playing");
    img?.classList.remove("is-hidden");
    muteBtn?.classList.remove("is-visible");
    return;
  }

  muteBtn?.classList.add("is-visible");

  if (video.getAttribute("src") !== src) {
    video.src = src;
    video.load();
  }

  if (shouldPlay()) {
    video.muted = muteBtn?.dataset.muted !== "false";
    const playPromise = video.play();
    if (playPromise?.catch) {
      playPromise.catch(() => {
        img?.classList.remove("is-hidden");
        video.classList.remove("is-playing");
      });
    }
    video.classList.add("is-playing");
    img?.classList.add("is-hidden");
  } else {
    video.pause();
    video.classList.remove("is-playing");
    img?.classList.remove("is-hidden");
  }

  if (muteBtn && muteIcon) {
    const isMuted = video.muted;
    muteIcon.innerHTML = isMuted ? MUTE_ICON : UNMUTE_ICON;
    muteBtn.setAttribute("aria-label", isMuted ? "Volume Off" : "Volume On");
    muteBtn.dataset.muted = isMuted ? "true" : "false";
  }
}

function initHeroVideo() {
  const heroSection = document.getElementById("heroBillboard");
  const video = document.getElementById("heroVideo");
  const img = document.getElementById("heroBackdropImg");
  const muteBtn = document.getElementById("heroMuteBtn");
  const muteIcon = document.getElementById("heroMuteIcon");
  const videoSrc = FEATURED.video || "";

  if (!heroSection || !video) return;

  img?.classList.remove("is-hidden");
  video.classList.remove("is-playing");

  if (!videoSrc) {
    muteBtn?.classList.remove("is-visible");
    video.removeAttribute("src");
    video.load();
    return;
  }

  if (muteBtn) muteBtn.dataset.muted = "true";
  muteBtn?.classList.add("is-visible");
  video.poster = FEATURED.backdrop;
  video.src = videoSrc;

  const shouldPlayHero = () => {
    const modal = document.getElementById("detailModal");
    const modalOpen = modal && !modal.classList.contains("hidden");
    if (modalOpen || document.hidden) return false;
    const rect = heroSection.getBoundingClientRect();
    return rect.bottom > 80 && rect.top < window.innerHeight * 0.75;
  };

  const updateHero = () => {
    setupVideoPlayback({
      video,
      img,
      muteBtn,
      muteIcon,
      src: videoSrc,
      shouldPlay: shouldPlayHero,
    });
  };

  muteBtn?.addEventListener("click", () => {
    video.muted = !video.muted;
    muteBtn.dataset.muted = video.muted ? "true" : "false";
    muteIcon.innerHTML = video.muted ? MUTE_ICON : UNMUTE_ICON;
    muteBtn.setAttribute("aria-label", video.muted ? "Volume Off" : "Volume On");
  });

  document.addEventListener("visibilitychange", updateHero);

  const observer = new IntersectionObserver(() => updateHero(), {
    threshold: [0, 0.25, 0.5, 0.75, 1],
  });
  observer.observe(heroSection);

  updateHero();
}

function openDetailModal(title, poster) {
  const modal = document.getElementById("detailModal");
  const details = getTitleDetails(title, poster);
  if (!modal) return;

  const heroImg = document.getElementById("detailHeroImg");
  const heroVideo = document.getElementById("detailHeroVideo");
  const titleLogo = document.getElementById("detailTitleLogo");
  const titleText = document.getElementById("detailModalTitle");
  const metaRow = document.getElementById("detailMetaRow");
  const synopsis = document.getElementById("detailSynopsis");
  const cast = document.getElementById("detailCast");
  const genres = document.getElementById("detailGenres");
  const mood = document.getElementById("detailMood");
  const seasonSelect = document.getElementById("detailSeasonSelect");
  const episodeList = document.getElementById("detailEpisodeList");
  const muteBtn = document.getElementById("detailMuteBtn");

  if (heroImg) {
    heroImg.src = details.backdrop || poster;
    heroImg.alt = title;
    heroImg.classList.remove("is-hidden");
  }

  if (heroVideo) {
    if (details.video) {
      heroVideo.src = details.video;
      heroVideo.load();
      heroVideo.classList.remove("is-playing");
      if (muteBtn) muteBtn.dataset.muted = "true";
    } else {
      heroVideo.pause();
      heroVideo.removeAttribute("src");
      heroVideo.load();
      heroVideo.classList.remove("is-playing");
      muteBtn?.classList.remove("is-visible");
    }
  }

  if (titleLogo && details.titleLogo) {
    titleLogo.src = details.titleLogo;
    titleLogo.alt = title;
    titleLogo.classList.remove("hidden");
    titleText?.classList.add("hidden");
  } else {
    titleLogo?.classList.add("hidden");
    if (titleText) {
      titleText.textContent = title;
      titleText.classList.remove("hidden");
    }
  }

  if (metaRow) {
    metaRow.innerHTML = `
      <span class="detail-match">${details.match}</span>
      <span>${details.year}</span>
      <span class="detail-badge">${details.episodes}</span>
      <span class="detail-badge">HD</span>
      <span class="detail-badge">${details.rating}</span>
      <span class="detail-badge">${details.maturity}</span>
    `;
  }

  if (synopsis) synopsis.textContent = details.description;
  if (cast) cast.textContent = details.cast;
  if (genres) genres.textContent = details.genres;
  if (mood) mood.textContent = details.mood;

  if (seasonSelect && episodeList) {
    const seasonNames = Object.keys(details.seasons);
    seasonSelect.innerHTML = seasonNames
      .map((name) => `<option value="${name}">${name}</option>`)
      .join("");

    const renderEpisodes = (seasonName) => {
      const episodes = details.seasons[seasonName] || [];
      episodeList.innerHTML = episodes
        .map(
          (ep) => `
        <li class="detail-episode-item">
          <span class="detail-episode-num">${ep.num}</span>
          <img src="${poster}" alt="" class="detail-episode-thumb" loading="lazy">
          <div class="detail-episode-info">
            <h4>${ep.title}</h4>
            <span class="detail-episode-duration">${ep.duration}</span>
            <p>${ep.synopsis}</p>
          </div>
        </li>
      `
        )
        .join("");
    };

    seasonSelect.onchange = () => renderEpisodes(seasonSelect.value);
    renderEpisodes(seasonNames[0]);
  }

  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  document.getElementById("heroVideo")?.pause();

  if (details.video) {
    muteBtn?.classList.add("is-visible");
    const shouldPlayModal = () =>
      !modal.classList.contains("hidden") && !document.hidden;

    setupVideoPlayback({
      video: heroVideo,
      img: heroImg,
      muteBtn,
      muteIcon: muteBtn?.querySelector("svg"),
      src: details.video,
      shouldPlay: shouldPlayModal,
    });

    muteBtn?.replaceWith(muteBtn.cloneNode(true));
    const newMuteBtn = document.getElementById("detailMuteBtn");
    newMuteBtn?.addEventListener("click", () => {
      if (!heroVideo) return;
      heroVideo.muted = !heroVideo.muted;
      newMuteBtn.dataset.muted = heroVideo.muted ? "true" : "false";
      const icon = newMuteBtn.querySelector("svg");
      if (icon) icon.innerHTML = heroVideo.muted ? MUTE_ICON : UNMUTE_ICON;
      newMuteBtn.setAttribute("aria-label", heroVideo.muted ? "Volume Off" : "Volume On");
    });
  } else {
    heroImg?.classList.remove("is-hidden");
  }
}

function closeDetailModal() {
  const modal = document.getElementById("detailModal");
  const detailVideo = document.getElementById("detailHeroVideo");
  const heroImg = document.getElementById("detailHeroImg");

  detailVideo?.pause();
  if (detailVideo) {
    detailVideo.classList.remove("is-playing");
    detailVideo.removeAttribute("src");
    detailVideo.load();
  }
  heroImg?.classList.remove("is-hidden");

  modal?.classList.add("hidden");
  modal?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  const heroVideo = document.getElementById("heroVideo");
  const heroSection = document.getElementById("heroBillboard");
  if (heroVideo?.src && FEATURED.video && heroSection) {
    const rect = heroSection.getBoundingClientRect();
    const visible = rect.bottom > 80 && rect.top < window.innerHeight * 0.75;
    if (visible && !document.hidden) {
      heroVideo.play().catch(() => {});
    }
  }
}

function initDetailModal() {
  document.getElementById("detailCloseBtn")?.addEventListener("click", closeDetailModal);
  document.getElementById("detailBackdrop")?.addEventListener("click", closeDetailModal);

  document.getElementById("featuredMoreInfoBtn")?.addEventListener("click", () => {
    openDetailModal(FEATURED.title, FEATURED.backdrop);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDetailModal();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (!NetflixAuth.requireProfile("profiles.html")) return;
  initFeatured();
  renderRows();
  initBrowseNav();
  initDetailModal();
});
