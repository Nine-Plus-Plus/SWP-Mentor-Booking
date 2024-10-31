package com.project.ultis;

import com.project.dto.CreateMentorRequest;
import com.project.dto.CreateStudentRequest;
import com.project.dto.SkillsDTO;
import com.project.dto.TopicDTO;
import com.project.enums.Gender;
import com.project.exception.OurException;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class ExcelHelper {

    public static List<CreateStudentRequest> excelToStudents(MultipartFile file) {
        try (
                InputStream is = file.getInputStream();
                Workbook workbook = new XSSFWorkbook(is);

                ) {

            List<CreateStudentRequest> studentRequests = new ArrayList<>();
            Sheet sheet = workbook.getSheetAt(0);
            int rowNumber = 0;

            for (Row row : sheet) {
                // Bỏ qua dòng tiêu đề
                if (rowNumber == 0) {
                    rowNumber++;
                    continue;
                }

                CreateStudentRequest studentRequest = new CreateStudentRequest();

                // Kiểm tra và xử lý các ô
                if (row.getCell(0) != null && row.getCell(0).getCellType() == CellType.STRING) {
                    studentRequest.setUsername(row.getCell(0).getStringCellValue());
                }

                if (row.getCell(1) != null && row.getCell(1).getCellType() == CellType.STRING) {
                    studentRequest.setEmail(row.getCell(1).getStringCellValue());
                }

                if (row.getCell(2) != null && row.getCell(2).getCellType() == CellType.STRING) {
                    studentRequest.setPassword(row.getCell(2).getStringCellValue());
                }

                if (row.getCell(3) != null && row.getCell(3).getCellType() == CellType.STRING) {
                    studentRequest.setFullName(row.getCell(3).getStringCellValue());
                }

                if (row.getCell(4) != null && row.getCell(4).getCellType() == CellType.NUMERIC) {
                    studentRequest.setBirthDate(row.getCell(4).getDateCellValue().toInstant().atZone(ZoneId.systemDefault()).toLocalDate());
                }

                if (row.getCell(5) != null && row.getCell(5).getCellType() == CellType.STRING) {
                    studentRequest.setAddress(row.getCell(5).getStringCellValue());
                }

                if (row.getCell(6) != null) {
                    if (row.getCell(6).getCellType() == CellType.NUMERIC) {
                        // Chuyển đổi số thành chuỗi và bỏ phần thập phân
                        studentRequest.setPhone(String.valueOf((long) row.getCell(6).getNumericCellValue()));
                    } else if (row.getCell(6).getCellType() == CellType.STRING) {
                        studentRequest.setPhone(row.getCell(6).getStringCellValue());
                    }
                }

                if (row.getCell(7) != null && row.getCell(7).getCellType() == CellType.STRING) {
                    studentRequest.setGender(Gender.valueOf(row.getCell(7).getStringCellValue()));
                }

                if (row.getCell(8) != null && row.getCell(8).getCellType() == CellType.STRING) {
                    studentRequest.setStudentCode(row.getCell(8).getStringCellValue());
                }

                // Thêm cột expertise
                if (row.getCell(9) != null && row.getCell(9).getCellType() == CellType.STRING) {
                    studentRequest.setExpertise(row.getCell(9).getStringCellValue());
                }

                // Thêm cột className
                if (row.getCell(10) != null && row.getCell(10).getCellType() == CellType.STRING) {
                    studentRequest.setClassName(row.getCell(10).getStringCellValue());
                }

                // Thêm đối tượng CreateStudentRequest vào danh sách
                studentRequests.add(studentRequest);
            }

            return studentRequests;
        } catch (Exception e) {
            throw new OurException("Error reading Excel file: " + e.getMessage());
        }
    }

    public static List<CreateMentorRequest> excelToMentors(MultipartFile file) {
        try (
                InputStream is = file.getInputStream();
                Workbook workbook = new XSSFWorkbook(is);
        ) {
            List<CreateMentorRequest> mentorRequests = new ArrayList<>();
            Sheet sheet = workbook.getSheetAt(0);
            int rowNumber = 0;

            for (Row row : sheet) {
                // Bỏ qua dòng tiêu đề
                if (rowNumber == 0) {
                    rowNumber++;
                    continue;
                }

                CreateMentorRequest mentorRequest = new CreateMentorRequest();

                // Kiểm tra và xử lý các ô
                if (row.getCell(0) != null && row.getCell(0).getCellType() == CellType.STRING) {
                    mentorRequest.setUsername(row.getCell(0).getStringCellValue());
                }

                if (row.getCell(1) != null && row.getCell(1).getCellType() == CellType.STRING) {
                    mentorRequest.setEmail(row.getCell(1).getStringCellValue());
                }

                if (row.getCell(2) != null && row.getCell(2).getCellType() == CellType.STRING) {
                    mentorRequest.setPassword(row.getCell(2).getStringCellValue());
                }

                if (row.getCell(3) != null && row.getCell(3).getCellType() == CellType.STRING) {
                    mentorRequest.setFullName(row.getCell(3).getStringCellValue());
                }

                if (row.getCell(4) != null && row.getCell(4).getCellType() == CellType.NUMERIC) {
                    mentorRequest.setBirthDate(row.getCell(4).getDateCellValue().toInstant().atZone(ZoneId.systemDefault()).toLocalDate());
                }

                if (row.getCell(5) != null && row.getCell(5).getCellType() == CellType.STRING) {
                    mentorRequest.setAddress(row.getCell(5).getStringCellValue());
                }

                if (row.getCell(6) != null) {
                    if (row.getCell(6).getCellType() == CellType.NUMERIC) {
                        // Chuyển đổi số thành chuỗi và bỏ phần thập phân
                        mentorRequest.setPhone(String.valueOf((long) row.getCell(6).getNumericCellValue()));
                    } else if (row.getCell(6).getCellType() == CellType.STRING) {
                        mentorRequest.setPhone(row.getCell(6).getStringCellValue());
                    }
                }

                if (row.getCell(7) != null && row.getCell(7).getCellType() == CellType.STRING) {
                    mentorRequest.setGender(Gender.valueOf(row.getCell(7).getStringCellValue()));
                }

                if (row.getCell(8) != null && row.getCell(8).getCellType() == CellType.STRING) {
                    mentorRequest.setMentorCode(row.getCell(8).getStringCellValue());
                }

                // Thêm cột skills
                if (row.getCell(9) != null && row.getCell(9).getCellType() == CellType.STRING) {
                    String skillsString = row.getCell(9).getStringCellValue();
                    List<String> skillsList = Arrays.stream(skillsString.split(","))
                            .map(String::trim)
                            .collect(Collectors.toList());
                    mentorRequest.setSkilllNamesList(skillsList);
                }

                // Thêm đối tượng CreateMentorRequest vào danh sách
                mentorRequests.add(mentorRequest);
            }

            return mentorRequests;
        } catch (Exception e) {
            throw new OurException("Error reading Excel file: " + e.getMessage());
        }
    }

    public static List<TopicDTO> excelToTopics(MultipartFile file){
        try (InputStream is = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(is);)
        {

            List<TopicDTO> topicRequests = new ArrayList<>();
            Sheet sheet = workbook.getSheetAt(0);
            int rowNumber = 0;

            for (Row row : sheet) {
                if (rowNumber == 0) {
                    rowNumber++;
                    continue; // Bỏ qua dòng tiêu đề
                }

                TopicDTO topicRequest = new TopicDTO();

                if (row.getCell(0) != null && row.getCell(0).getCellType() == CellType.STRING) {
                    topicRequest.setTopicName(row.getCell(0).getStringCellValue());
                }

                if (row.getCell(1) != null && row.getCell(1).getCellType() == CellType.STRING) {
                    topicRequest.setContext(row.getCell(1).getStringCellValue());
                }

                if (row.getCell(2) != null && row.getCell(2).getCellType() == CellType.STRING) {
                    topicRequest.setProblems(row.getCell(2).getStringCellValue());
                }

                if (row.getCell(3) != null && row.getCell(3).getCellType() == CellType.STRING) {
                    String actorString = row.getCell(3).getStringCellValue();
                    List<String> actorList = Arrays.asList(actorString.split(","));
                    topicRequest.setActor(actorList);
                }

                if (row.getCell(4) != null && row.getCell(4).getCellType() == CellType.STRING) {
                    String requirementString = row.getCell(4).getStringCellValue();
                    List<String> requirementList = Arrays.asList(requirementString.split(","));
                    topicRequest.setRequirement(requirementList);
                }

                if (row.getCell(5) != null && row.getCell(5).getCellType() == CellType.STRING) {
                    String nonFuncRequirementString = row.getCell(5).getStringCellValue();
                    List<String> nonFuncReqList = Arrays.asList(nonFuncRequirementString.split(","));
                    topicRequest.setNonFunctionRequirement(nonFuncReqList);
                }

                if (row.getCell(6) != null && row.getCell(6).getCellType() == CellType.STRING) {
                    topicRequest.setMentorName(row.getCell(6).getStringCellValue());
                }

                if (row.getCell(7) != null && row.getCell(7).getCellType() == CellType.STRING) {
                    topicRequest.setSubMentorName(row.getCell(7).getStringCellValue());
                }

                if (row.getCell(8) != null && row.getCell(8).getCellType() == CellType.STRING) {
                    topicRequest.setSemesterName(  row.getCell(8).getStringCellValue());
                }

                topicRequests.add(topicRequest);
            }

            return topicRequests;
        } catch (Exception e) {
            throw new OurException("Error reading Excel file: " + e.getMessage());
        }
    }

}
