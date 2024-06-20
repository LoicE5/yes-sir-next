# Yes Sir
Yes Sir is a web application built for illustrating a friend's group startup idea and pitch at ESSEC Business School (France). The purpose is to enhance the attendance checks in today's classes, using a 1-time code system that both teacher and students can use.

Built with Next.js & Supabase, it features three pages :

- Home : The welcome page where the user can indicate if he or she is a student or a teacher
- Teacher : The homepage for the teacher, who will be able to generate a 1-time unique code for his class (OTP-inspired).
- Student : The homepage for the students, who will be able to enter the code and confirm their attendance.

The app itself was made to remain as easy as possible to use. However, it features extra functionalities to detect cheating. Not requiring any user authentication, cheating is detected using ipv4/ipv6 comparing and localStorage key storage. Not invulnerable yet, it still gives the teacher key insights about who is attempting to cheat or not (such as a student registering for his/her friend), when not denying the access completely.

# How to start

`cp .env.local.example .env.local`

Then set your own [supabase](https://supabase.com/) and [IP quality score](https://www.ipqualityscore.com/) details.

`npm run dev`

or

`bun dev`

# View the project

[View the project here.](https://yes-sir-class.vercel.app/)

# Legal

<p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><a property="dct:title" rel="cc:attributionURL" href="https://yes-sir-class.vercel.app/">Yes Sir</a> by <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://github.com/loice5">Loïc Etienne</a> is licensed under <a href="http://creativecommons.org/licenses/by-nc-nd/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">CC BY-NC-ND 4.0<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/nd.svg?ref=chooser-v1"></a></p>