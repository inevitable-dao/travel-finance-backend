CREATE TABLE IF NOT EXISTS `users`
(
    u_index    INT          NOT NULL AUTO_INCREMENT,
    u_username VARCHAR(200)  NOT NULL DEFAULT '' COMMENT '유저이름',
    u_password VARCHAR(255)  NOT NULL DEFAULT '' COMMENT '유저비밀번호',
    u_point    INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '포인트',
    PRIMARY KEY (`u_index`),
    UNIQUE KEY (`u_username`)
) ENGINE = InnoDB COMMENT '유저';

CREATE TABLE IF NOT EXISTS `user_card_packages`
(
    ucp_index              INT      NOT NULL AUTO_INCREMENT,
    ucp_user_index         INT      NOT NULL COMMENT '유저 INDEX',
    ucp_card_package_index INT      NOT NULL COMMENT '구매한 패키지 INDEX',
    ucp_register_datetime  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '획득일자',
    PRIMARY KEY (`ucp_index`)
) ENGINE = InnoDB COMMENT '유저가 구매한 카드 패키지';

CREATE TABLE IF NOT EXISTS `user_cards`
(
    uc_index             INT      NOT NULL AUTO_INCREMENT,
    uc_user_index       INT      NOT NULL COMMENT '유저 INDEX',
    uc_card_index        INT      NOT NULL COMMENT '구매한 카드 INDEX',
    uc_is_use            ENUM ('Y', 'N')   DEFAULT 'Y' COMMENT '사용여부 (만약 A카드를 B카드로 강화하면 A와 B모두 N이 되며, C카드가 새로이 생긴다)',
    uc_register_datetime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '획득일자',
    PRIMARY KEY (`uc_index`)
) ENGINE = InnoDB COMMENT '유저가 오픈한(소유한) 카드';

CREATE TABLE IF NOT EXISTS `cards`
(
    c_index                INT          NOT NULL AUTO_INCREMENT,
    c_card_package_indexes INT          NOT NULL COMMENT '이 카드를 가질 수 있는 패키지들 (콤마로 구분)',
    c_name                 VARCHAR(255) NOT NULL COMMENT '카드 이름',
    c_type                 VARCHAR(100) NOT NULL COMMENT '카드 타입, TRANSPORT, ATTRACTION, ACTIVITY, MEAL, STAY',
    c_description          TEXT         NULL COMMENT '카드 디테일설명',
    c_address              VARCHAR(255) NOT NULL DEFAULT '' COMMENT '주소',
    c_estimated_hours      INT          NOT NULL DEFAULT 0 COMMENT '예상시간 (STAY, TRANSPORT은 0)',
    c_cost_value           INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '얼마만큼의 값어치',
    c_rank                 INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '상대값 (높을 수록 높은 등급)',
    PRIMARY KEY (`c_index`)
) ENGINE = InnoDB COMMENT '카드';

CREATE TABLE IF NOT EXISTS `card_packages`
(
    cp_index          INT          NOT NULL AUTO_INCREMENT,
    cp_name           VARCHAR(255) NOT NULL COMMENT '패키지 이름',
    cp_original_price INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '기본가',
    cp_price          INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '가격',
    PRIMARY KEY (`cp_index`)
) ENGINE = InnoDB COMMENT '카드 패키지';

CREATE TABLE IF NOT EXISTS `journey`
(
    j_index             INT      NOT NULL AUTO_INCREMENT,
    j_user_index        INT      NOT NULL COMMENT '유저 인덱스',
    j_start_datetime    DATETIME NOT NULL DEFAULT '1970-01-01 00:00:00',
    j_end_datetime      DATETIME NOT NULL COMMENT '1970-01-01 00:00:00',
    j_user_card_indexes TEXT     NULL COMMENT '사용한 user_cards 인덱스',
    PRIMARY KEY (`j_index`)
) ENGINE = InnoDB COMMENT '여정';
