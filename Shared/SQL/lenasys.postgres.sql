DROP TABLE IF EXISTS useranswer;
DROP TABLE IF EXISTS "user_course";
DROP TABLE IF EXISTS "variant" CASCADE;
DROP TABLE IF EXISTS "vers";
DROP TABLE IF EXISTS "word";
DROP TABLE IF EXISTS "wordlist";
DROP TABLE IF EXISTS "box" CASCADE;
DROP TABLE IF EXISTS "class" CASCADE;
DROP TABLE IF EXISTS "codeexample" CASCADE;
DROP TABLE IF EXISTS "course" CASCADE;
DROP TABLE IF EXISTS "course_req";
DROP TABLE IF EXISTS "eventlog";
DROP TABLE IF EXISTS filelink;
DROP TABLE IF EXISTS "improw";
DROP TABLE IF EXISTS "impwordlist";
DROP TABLE IF EXISTS "list";
DROP TABLE IF EXISTS "listentries" CASCADE;
DROP TABLE IF EXISTS "partresult";
DROP TABLE IF EXISTS "playereditor_playbacks";
DROP TABLE IF EXISTS "programcourse";
DROP TABLE IF EXISTS "quiz" CASCADE;
DROP TABLE IF EXISTS "sequence";
DROP TABLE IF EXISTS "studentresultat";
DROP TABLE IF EXISTS "subparts";
DROP TABLE IF EXISTS "template";
DROP TABLE IF EXISTS "user" CASCADE;

CREATE TABLE "user" (
    uid SERIAL NOT NULL PRIMARY KEY,
    username varchar(160) NOT NULL UNIQUE,
    firstname varchar(100) DEFAULT NULL,
    lastname varchar(100) DEFAULT NULL,
    ssn varchar(40) DEFAULT NULL UNIQUE,
    userpassword varchar(450) NOT NULL,
    lastupdated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    addedtime timestamp  DEFAULT now(),
    lastvisit timestamp  DEFAULT now(),
    newpassword int4 DEFAULT NULL,
    creator integer  DEFAULT NULL,
    superuser int4 DEFAULT NULL,
    email varchar(512) DEFAULT NULL,
    class varchar(20) DEFAULT NULL,
    totalhp decimal(4,1) DEFAULT NULL
);
INSERT INTO "user" VALUES (1,'Grimling','Johan','Grimling','810101-5567','$2y$12$stG4CWU//NCdnbAQi.KTHO2V0UVDVi89Lx5ShDvIh/d8.J4vO8o8m','2016-02-11 20:49:47',now(),now(),0,1,1,NULL,NULL,NULL),(2,'Toddler','Toddler','Kong','444444-5447','*3772748C9A2CC6FC988DEC752054B06436E62B43','2016-02-11 20:49:47',now(),now(),0,1,1,NULL,NULL,NULL),(3,'Tester',NULL,NULL,'111111-1111','$2y$12$IHb86c8/PFyI5fa9r8B0But7rugtGKtogyp/2X0OuB3GJl9l0iJ.q','2016-02-11 20:49:38',now(),now(),1,1,NULL,NULL,NULL,NULL);

CREATE TABLE useranswer (
    aid SERIAL NOT NULL PRIMARY KEY,
    cid integer  NOT NULL,
    quiz integer DEFAULT NULL,
    variant integer DEFAULT NULL,
    moment integer  NOT NULL,
    grade int4 DEFAULT NULL,
    uid integer  NOT NULL,
    useranswer varchar(4096) DEFAULT NULL,
    submitted timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    marked timestamp NULL DEFAULT NULL,
    vers varchar(16) DEFAULT NULL,
    creator integer DEFAULT NULL,
    score integer DEFAULT NULL,
    timeused integer DEFAULT NULL,
    totaltimeused integer DEFAULT '0',
    stepsused integer DEFAULT NULL,
    totalstepsused integer DEFAULT '0'
);

CREATE TABLE user_course (
    uid SERIAL NOT NULL PRIMARY KEY,
    cid integer  NOT NULL,
    result decimal(2,1) NOT NULL,
    modified timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    creator integer DEFAULT NULL,
    access varchar(20) NOT NULL,
    period integer NOT NULL,
    term char(5) NOT NULL
);

CREATE TABLE variant (
    vid SERIAL NOT NULL PRIMARY KEY,
    quizid integer DEFAULT NULL,
    param varchar(4096) DEFAULT NULL,
    variantanswer varchar(4096) DEFAULT NULL,
    modified timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    creator integer DEFAULT NULL,
    disabled int4 DEFAULT NULL
);

CREATE TABLE vers (
    cid SERIAL NOT NULL,
    vers varchar(16) NOT NULL,
    versname varchar(90) NOT NULL,
    coursecode varchar(90) NOT NULL,
    coursename varchar(90) NOT NULL,
    coursenamealt varchar(90) NOT NULL,
    PRIMARY KEY (cid,vers)
);

CREATE TABLE word (
    wordid SERIAL  NOT NULL,
    wordlistid integer  NOT NULL,
    word varchar(128) DEFAULT NULL,
    label varchar(512) DEFAULT NULL,
    updated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    uid integer  NOT NULL,
    PRIMARY KEY (wordid,wordlistid)
);

INSERT INTO word VALUES (1,1,'for','A','2016-02-11 20:49:47',1),(2,1,'function','B','2016-02-11 20:49:48',1),(3,1,'if','C','2016-02-11 20:49:48',1),(4,1,'var','D','2016-02-11 20:49:48',1),(5,2,'echo','A','2016-02-11 20:49:48',1),(6,2,'function','B','2016-02-11 20:49:48',1),(7,2,'if','C','2016-02-11 20:49:48',1),(8,2,'else','D','2016-02-11 20:49:48',1),(9,3,'onclick','A','2016-02-11 20:49:48',1),(10,3,'onload','B','2016-02-11 20:49:48',1),(11,3,'class','C','2016-02-11 20:49:48',1),(12,3,'id','D','2016-02-11 20:49:48',1),(13,5,'abstract','A','2016-02-11 20:49:48',1),(14,5,'continue','B','2016-02-11 20:49:48',1),(15,5,'for','C','2016-02-11 20:49:48',1),(16,5,'new','D','2016-02-11 20:49:48',1),(17,5,'switch','A','2016-02-11 20:49:48',1),(18,5,'assert','B','2016-02-11 20:49:48',1),(19,5,'default','C','2016-02-11 20:49:48',1),(20,5,'goto','D','2016-02-11 20:49:49',1),(21,5,'package','A','2016-02-11 20:49:49',1),(22,5,'synchronized','B','2016-02-11 20:49:49',1),(23,5,'boolean','C','2016-02-11 20:49:49',1),(24,5,'do','D','2016-02-11 20:49:49',1),(25,5,'if','A','2016-02-11 20:49:49',1),(26,5,'private','B','2016-02-11 20:49:49',1),(27,5,'this','C','2016-02-11 20:49:49',1),(28,5,'break','D','2016-02-11 20:49:49',1),(29,5,'double','A','2016-02-11 20:49:49',1),(30,5,'implements','B','2016-02-11 20:49:49',1),(31,5,'protected','C','2016-02-11 20:49:49',1),(32,5,'throw','D','2016-02-11 20:49:49',1),(33,5,'byte','A','2016-02-11 20:49:49',1),(34,5,'else','B','2016-02-11 20:49:49',1),(35,5,'import','C','2016-02-11 20:49:50',1),(36,5,'public','D','2016-02-11 20:49:50',1),(37,5,'throws','A','2016-02-11 20:49:50',1),(38,5,'case','B','2016-02-11 20:49:50',1),(39,5,'enum','C','2016-02-11 20:49:50',1),(40,5,'var','D','2016-02-11 20:49:50',1),(41,5,'catch','A','2016-02-11 20:49:50',1),(42,5,'instanceof','B','2016-02-11 20:49:50',1),(43,5,'return','C','2016-02-11 20:49:50',1),(44,5,'transient','D','2016-02-11 20:49:50',1),(45,5,'extends','A','2016-02-11 20:49:50',1),(46,5,'int','B','2016-02-11 20:49:50',1),(47,5,'short','C','2016-02-11 20:49:50',1),(48,5,'try','D','2016-02-11 20:49:50',1),(49,5,'char','B','2016-02-11 20:49:50',1),(50,5,'final','C','2016-02-11 20:49:50',1),(51,5,'interface','D','2016-02-11 20:49:50',1),(52,5,'static','A','2016-02-11 20:49:50',1),(53,5,'class','B','2016-02-11 20:49:50',1),(54,5,'long','C','2016-02-11 20:49:50',1),(55,5,'strictfp','D','2016-02-11 20:49:50',1),(56,5,'volatile','A','2016-02-11 20:49:51',1),(57,5,'float','B','2016-02-11 20:49:51',1),(58,5,'native','C','2016-02-11 20:49:51',1),(59,5,'super','D','2016-02-11 20:49:51',1),(60,5,'while','A','2016-02-11 20:49:51',1);

CREATE TABLE wordlist (
    wordlistid SERIAL NOT NULL PRIMARY KEY,
    wordlistname varchar(48) DEFAULT NULL,
    updated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    uid integer  NOT NULL
);

INSERT INTO wordlist VALUES (1,'JS','2016-02-11 20:49:47',1),(2,'PHP','2016-02-11 20:49:47',1),(3,'HTML','2016-02-11 20:49:47',1),(4,'Plain Text','2016-02-11 20:49:47',1),(5,'Java','2016-02-11 20:49:47',1),(6,'SR','2016-02-11 20:49:47',1);

CREATE TABLE box (
    boxid SERIAL NOT NULL,
    exampleid integer  NOT NULL,
    boxtitle varchar(40) DEFAULT NULL,
    boxcontent varchar(128) DEFAULT NULL,
    filename varchar(128) DEFAULT NULL,
    settings varchar(2048) DEFAULT NULL,
    wordlistid integer  DEFAULT NULL,
    segment text,
    PRIMARY KEY (boxid,exampleid)
);

CREATE TABLE "class" (
    "class" varchar(20) NOT NULL UNIQUE,
    responsible integer  NOT NULL PRIMARY KEY,
    classname varchar(200) DEFAULT NULL,
    regcode integer DEFAULT NULL,
    classcode varchar(16) DEFAULT NULL,
    hp decimal(10,1) DEFAULT NULL,
    tempo integer DEFAULT NULL,
    hpprogress decimal(3,1) DEFAULT NULL
);

CREATE TABLE codeexample (
    exampleid SERIAL  NOT NULL PRIMARY KEY,
    cid integer  NOT NULL,
    examplename varchar(128) DEFAULT NULL,
    sectionname varchar(128) DEFAULT NULL,
    beforeid integer DEFAULT NULL,
    afterid integer DEFAULT NULL,
    runlink varchar(128) DEFAULT NULL,
    cversion integer DEFAULT NULL,
    public int4  NOT NULL DEFAULT '0',
    updated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    uid integer  NOT NULL,
    templateid integer  NOT NULL DEFAULT '0'
);

CREATE TABLE course (
    cid SERIAL  NOT NULL PRIMARY KEY,
    coursecode varchar(90) DEFAULT NULL UNIQUE,
    coursename varchar(160) DEFAULT NULL,
    created timestamp with time zone DEFAULT NULL,
    creator integer  NOT NULL,
    visibility int4  NOT NULL DEFAULT '0',
    updated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    activeversion varchar(16) DEFAULT NULL,
    activeedversion varchar(16) DEFAULT NULL,
    capacity integer DEFAULT NULL,
    hp decimal(4,1) NOT NULL DEFAULT '7.5',
    courseHttpPage varchar(4000) DEFAULT NULL
);

CREATE TABLE course_req (
    cid integer  NOT NULL,
    req_cid integer  NOT NULL,
    PRIMARY KEY ("cid","req_cid")
);

CREATE TABLE eventlog (
    eid bigint NOT NULL PRIMARY KEY,
    type int4 DEFAULT '0',
    ts timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    address varchar(90) DEFAULT NULL,
    raddress varchar(90) DEFAULT NULL,
    "user" varchar(256) DEFAULT NULL,
    eventtext text NOT NULL
);

CREATE TABLE filelink (
    fileid SERIAL NOT NULL PRIMARY KEY,
    filename varchar(256) NOT NULL,
    kind integer DEFAULT NULL,
    cid integer  NOT NULL,
    isGlobal int4 DEFAULT '0'
);

CREATE TABLE improw (
    impid SERIAL NOT NULL,
    boxid integer NOT NULL,
    exampleid integer  NOT NULL,
    istart integer DEFAULT NULL,
    iend integer DEFAULT NULL,
    irowdesc varchar(2048) DEFAULT NULL,
    updated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    uid integer  NOT NULL,
    PRIMARY KEY (impid,exampleid,boxid)
);

CREATE TABLE impwordlist (
    wordid SERIAL NOT NULL PRIMARY KEY,
    exampleid integer  NOT NULL,
    word varchar(128) DEFAULT NULL,
    label varchar(512) DEFAULT NULL,
    UPDATED timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    uid integer  NOT NULL
);

CREATE TABLE list (
    listnr integer DEFAULT NULL,
    listeriesid integer DEFAULT NULL,
    provdatum date DEFAULT NULL,
    responsible varchar(80) DEFAULT NULL,
    responsibledate date DEFAULT NULL,
    course integer DEFAULT NULL,
    listid SERIAL NOT NULL PRIMARY KEY
);

CREATE TABLE listentries (
    lid SERIAL NOT NULL PRIMARY KEY,
    cid integer NOT NULL,
    entryname varchar(128) DEFAULT NULL,
    link varchar(400) DEFAULT NULL,
    kind integer  DEFAULT NULL,
    pos integer DEFAULT NULL,
    creator integer  NOT NULL,
    ts timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    code_id integer  DEFAULT NULL,
    visible int4  NOT NULL DEFAULT '0',
    vers varchar(16) DEFAULT NULL,
    moment integer  DEFAULT NULL,
    gradesystem int4 DEFAULT NULL,
    highscoremode integer DEFAULT '0'
);

CREATE TABLE partresult (
    cid integer  NOT NULL,
    uid integer  NOT NULL,
    partname varchar(100) NOT NULL DEFAULT '',
    grade varchar(2) NOT NULL DEFAULT '',
    hp decimal(3,1) DEFAULT NULL,
    PRIMARY KEY (partname,cid,uid,grade)
);

CREATE TABLE playereditor_playbacks (
    id varchar(64) NOT NULL,
    type int2 NOT NULL,
    path varchar(512) NOT NULL,
    PRIMARY KEY (id,type)
);

CREATE TABLE programcourse (
    class varchar(20) NOT NULL DEFAULT '',
    cid integer  NOT NULL,
    period integer DEFAULT NULL,
    term varchar(20) DEFAULT NULL,
    PRIMARY KEY (cid,class)
);

CREATE TABLE quiz (
    id SERIAL NOT NULL PRIMARY KEY,
    cid integer  NOT NULL,
    autograde int4 NOT NULL DEFAULT '0',
    gradesystem int4 NOT NULL DEFAULT '2',
    qname varchar(510) NOT NULL DEFAULT '',
    quizfile varchar(510) NOT NULL DEFAULT 'default',
    qrelease timestamp with time zone DEFAULT NULL,
    deadline timestamp with time zone DEFAULT NULL,
    modified timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    creator integer DEFAULT NULL
);

CREATE TABLE sequence (
    seqid SERIAL  NOT NULL,
    cid integer  NOT NULL,
    exampleseq text NOT NULL,
    PRIMARY KEY (cid,seqid)
);

CREATE TABLE studentresultat (
    sid SERIAL NOT NULL PRIMARY KEY,
    pnr varchar(22) DEFAULT NULL,
    anmkod varchar(12) DEFAULT NULL,
    kurskod varchar(12) NOT NULL,
    termin varchar(10) DEFAULT NULL,
    resultat decimal(3,1) DEFAULT NULL,
    avbrott date DEFAULT NULL
);

CREATE TABLE subparts (
    partname varchar(100) NOT NULL DEFAULT '',
    cid integer  NOT NULL,
    parthp decimal(3,1) DEFAULT NULL,
    difgrade varchar(20) DEFAULT NULL,
    PRIMARY KEY (partname,cid)
);

CREATE TABLE template (
    templateid integer  NOT NULL UNIQUE,
    stylesheet varchar(78) NOT NULL,
    numbox integer NOT NULL,
    PRIMARY KEY (templateid,stylesheet)
);

INSERT INTO "template" VALUES (0,'template0.css',0),(1,'template1.css',2),(2,'template2.css',2),(3,'template3.css',3),(4,'template4.css',3),(5,'template5.css',4),(6,'template6.css',4);

ALTER TABLE "box" ADD CONSTRAINT "fk_box_joins_codeexample" FOREIGN KEY ("exampleid") REFERENCES "codeexample" ("exampleid") DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX ON "box" ("exampleid");
ALTER TABLE "class" ADD CONSTRAINT "class_ibfk_1" FOREIGN KEY ("responsible") REFERENCES "user" ("uid") DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX ON "class" ("responsible");
ALTER TABLE "codeexample" ADD CONSTRAINT "fk_codeexample_joins_course" FOREIGN KEY ("cid") REFERENCES "course" ("cid") DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX ON "codeexample" ("cid");
ALTER TABLE "codeexample" ADD CONSTRAINT "fk_codeexample_joins_template" FOREIGN KEY ("templateid") REFERENCES "template" ("templateid") DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX ON "codeexample" ("templateid");
ALTER TABLE "codeexample" ADD CONSTRAINT "fk_codeexample_joins_user" FOREIGN KEY ("uid") REFERENCES "user" ("uid") DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX ON "codeexample" ("uid");
ALTER TABLE "course" ADD CONSTRAINT "fk_course_joins_user" FOREIGN KEY ("creator") REFERENCES "user" ("uid") DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX ON "course" ("creator");
ALTER TABLE "course_req" ADD CONSTRAINT "course_req_ibfk_1" FOREIGN KEY ("cid") REFERENCES "course" ("cid") DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX ON "course_req" ("cid");
ALTER TABLE "course_req" ADD CONSTRAINT "course_req_ibfk_2" FOREIGN KEY ("req_cid") REFERENCES "course" ("cid") DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX ON "course_req" ("req_cid");
ALTER TABLE "filelink" ADD CONSTRAINT "fk_filelink_joins_course" FOREIGN KEY ("cid") REFERENCES "course" ("cid") DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX ON "filelink" ("cid");
ALTER TABLE "improw" ADD CONSTRAINT "fk_improw_joins_box" FOREIGN KEY ("boxid", "exampleid") REFERENCES "box" ("boxid", "exampleid") DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX ON "improw" ("boxid", "exampleid");
ALTER TABLE "improw" ADD CONSTRAINT "fk_improw_joins_user" FOREIGN KEY ("uid") REFERENCES "user" ("uid") DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX ON "improw" ("uid");
ALTER TABLE "impwordlist" ADD CONSTRAINT "fk_impwordlist_joins_codeexample" FOREIGN KEY ("exampleid") REFERENCES "codeexample" ("exampleid") DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX ON "impwordlist" ("exampleid");
ALTER TABLE "impwordlist" ADD CONSTRAINT "fk_impwordlist_joins_user" FOREIGN KEY ("uid") REFERENCES "user" ("uid") DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX ON "impwordlist" ("uid");
ALTER TABLE "listentries" ADD CONSTRAINT "fk_listentries_joins_user" FOREIGN KEY ("creator") REFERENCES "user" ("uid") ON DELETE NO ACTION ON UPDATE NO ACTION DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX ON "listentries" ("creator");
ALTER TABLE "listentries" ADD CONSTRAINT "listentries_ibfk_1" FOREIGN KEY ("cid") REFERENCES "course" ("cid") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX ON "listentries" ("cid");
ALTER TABLE "partresult" ADD CONSTRAINT "partresult_ibfk_1" FOREIGN KEY ("partname", "cid") REFERENCES "subparts" ("partname", "cid") DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX ON "partresult" ("partname", "cid");
ALTER TABLE "partresult" ADD CONSTRAINT "partresult_ibfk_2" FOREIGN KEY ("uid") REFERENCES "user" ("uid") DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX ON "partresult" ("uid");
ALTER TABLE "programcourse" ADD CONSTRAINT "programcourse_ibfk_1" FOREIGN KEY ("cid") REFERENCES "course" ("cid") DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX ON "programcourse" ("cid");
ALTER TABLE "programcourse" ADD CONSTRAINT "programcourse_ibfk_2" FOREIGN KEY ("class") REFERENCES "class" ("class") DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX ON "programcourse" ("class");
ALTER TABLE "quiz" ADD CONSTRAINT "fk_quiz_joins_course" FOREIGN KEY ("cid") REFERENCES "course" ("cid") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX ON "quiz" ("cid");
ALTER TABLE "subparts" ADD CONSTRAINT "subparts_ibfk_1" FOREIGN KEY ("cid") REFERENCES "course" ("cid") DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX ON "subparts" ("cid");
ALTER TABLE "useranswer" ADD CONSTRAINT "fk_useranswer_joins_course" FOREIGN KEY ("cid") REFERENCES "course" ("cid") DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX ON "useranswer" ("cid");
ALTER TABLE "useranswer" ADD CONSTRAINT "fk_useranswer_joins_listentries" FOREIGN KEY ("moment") REFERENCES "listentries" ("lid") DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX ON "useranswer" ("moment");
ALTER TABLE "useranswer" ADD CONSTRAINT "fk_useranswer_joins_quiz" FOREIGN KEY ("quiz") REFERENCES "quiz" ("id") DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX ON "useranswer" ("quiz");
ALTER TABLE "useranswer" ADD CONSTRAINT "fk_useranswer_joins_user" FOREIGN KEY ("uid") REFERENCES "user" ("uid") DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX ON "useranswer" ("uid");
ALTER TABLE "useranswer" ADD CONSTRAINT "fk_useranswer_joins_variant" FOREIGN KEY ("variant") REFERENCES "variant" ("vid") DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX ON "useranswer" ("variant");
ALTER TABLE "user_course" ADD CONSTRAINT "user_course_joins_course" FOREIGN KEY ("cid") REFERENCES "course" ("cid") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX ON "user_course" ("cid");
ALTER TABLE "user_course" ADD CONSTRAINT "user_course_joins_user" FOREIGN KEY ("uid") REFERENCES "user" ("uid") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX ON "user_course" ("uid");
ALTER TABLE "variant" ADD CONSTRAINT "fk_variant_joins_quiz" FOREIGN KEY ("quizid") REFERENCES "quiz" ("id") ON DELETE CASCADE ON UPDATE CASCADE DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX ON "variant" ("quizid");
ALTER TABLE "vers" ADD CONSTRAINT "fk_vers_joins_course" FOREIGN KEY ("cid") REFERENCES "course" ("cid") DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX ON "vers" ("cid");
ALTER TABLE "word" ADD CONSTRAINT "fk_word_joins_user" FOREIGN KEY ("uid") REFERENCES "user" ("uid") DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX ON "word" ("uid");
ALTER TABLE "word" ADD CONSTRAINT "fk_word_joins_wordlist" FOREIGN KEY ("wordlistid") REFERENCES "wordlist" ("wordlistid") DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX ON "word" ("wordlistid");
ALTER TABLE "wordlist" ADD CONSTRAINT "pk_wordlist_joins_user" FOREIGN KEY ("uid") REFERENCES "user" ("uid") DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX ON "wordlist" ("uid");

-- Sequences --
/*CREATE SEQUENCE quiz_id_seq;
SELECT setval('quiz_id_seq', max(id)) FROM quiz;*/
/*ALTER TABLE "quiz" ALTER COLUMN "id" SET DEFAULT nextval('quiz_id_seq');*/

