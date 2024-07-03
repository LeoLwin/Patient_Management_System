/*
SQLyog Community v13.2.1 (64 bit)
MySQL - 8.4.0 
*********************************************************************
*/
/*!40101 SET NAMES utf8 */;

create table `file` (
	`id` int (11),
	`patient_id` int (11),
	`name` varchar (765),
	`path` varchar (3072),
	`size` varchar (765),
	`upload_dateTime` timestamp ,
	`type` char (18)
); 
insert into `file` (`id`, `patient_id`, `name`, `path`, `size`, `upload_dateTime`, `type`) values('41','1201','kyaw thutaddd','path path','0 MB','2024-06-21 11:29:57','folder');
insert into `file` (`id`, `patient_id`, `name`, `path`, `size`, `upload_dateTime`, `type`) values('42','1201','kyaw thutaddd','path path','0 MB','2024-06-21 11:06:57','folder');
insert into `file` (`id`, `patient_id`, `name`, `path`, `size`, `upload_dateTime`, `type`) values('43','1','kyaw thuta','main','0MB','2024-06-24 13:26:11','folder');
insert into `file` (`id`, `patient_id`, `name`, `path`, `size`, `upload_dateTime`, `type`) values('44','1','kyaw thuta','main info','0MB','2024-06-24 13:26:44','folder');
insert into `file` (`id`, `patient_id`, `name`, `path`, `size`, `upload_dateTime`, `type`) values('45','1','kyaw thuta','main info lab','0MB','2024-06-24 13:27:06','folder');
insert into `file` (`id`, `patient_id`, `name`, `path`, `size`, `upload_dateTime`, `type`) values('46','1','kyaw thuta new','main info lab','0MB','2024-06-24 13:28:28','folder');
insert into `file` (`id`, `patient_id`, `name`, `path`, `size`, `upload_dateTime`, `type`) values('47','1','kyaw thuta new dfdfd','main info','0MB','2024-06-24 13:28:36','folder');
insert into `file` (`id`, `patient_id`, `name`, `path`, `size`, `upload_dateTime`, `type`) values('48','1','kyaw thuta','http://localhost:3000/uploads/2f60e593-9dc8-4039-8161-89dcc2e27f94-CoCOs.png','102 KB','2024-06-24 13:30:36','file');
insert into `file` (`id`, `patient_id`, `name`, `path`, `size`, `upload_dateTime`, `type`) values('49','1','kyaw thuta','http://localhost:3000/uploads/136eaa50-fc7a-4a12-8dce-df1714a20c24-hospital_lab_history (3).xlsx','16 KB','2024-06-24 13:33:28','file');
insert into `file` (`id`, `patient_id`, `name`, `path`, `size`, `upload_dateTime`, `type`) values('50','1','kyaw thuta','http://localhost:3000/uploads/a7663f29-35ff-48d1-bdbc-c39fb8ef669e-bandicam 2024-06-12 11-22-28-953.mp4','11 MB','2024-06-24 13:35:56','file');
insert into `file` (`id`, `patient_id`, `name`, `path`, `size`, `upload_dateTime`, `type`) values('51','1','kyaw thuta new dfdfd','main info lab','0MB','2024-06-24 13:57:53','folder');
insert into `file` (`id`, `patient_id`, `name`, `path`, `size`, `upload_dateTime`, `type`) values('52','1','kyaw thuta new dfdfd','main info lab','0MB','2024-06-24 13:58:38','folder');
insert into `file` (`id`, `patient_id`, `name`, `path`, `size`, `upload_dateTime`, `type`) values('53','1201','kyaw thutaddd','path path','0 MB','2024-06-24 14:34:55','folder');
insert into `file` (`id`, `patient_id`, `name`, `path`, `size`, `upload_dateTime`, `type`) values('54','1','http://localhost:3000/uploads/2dc56c0e-efde-4cc6-91f2-e134adc41cc2-CoCOs.png','main','102 KB','2024-06-24 15:41:38','folder');
insert into `file` (`id`, `patient_id`, `name`, `path`, `size`, `upload_dateTime`, `type`) values('55','1201','kyaw thutaddd','path path','0 MB','2024-06-24 14:35:10','folder');
