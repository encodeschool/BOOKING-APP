import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../providers/booking_provider.dart';

import '../utils/booking_navigation.dart';

class Step5Customer
    extends ConsumerStatefulWidget {
  const Step5Customer({super.key});

  @override
  ConsumerState<Step5Customer>
  createState() =>
      _Step5CustomerState();
}

class _Step5CustomerState
    extends ConsumerState<Step5Customer> {
  final _formKey =
  GlobalKey<FormState>();

  final nameController =
  TextEditingController();

  final emailController =
  TextEditingController();

  final phoneController =
  TextEditingController();

  final notesController =
  TextEditingController();

  bool saveDetails = true;

  @override
  void dispose() {
    nameController.dispose();
    emailController.dispose();
    phoneController.dispose();
    notesController.dispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return SafeArea(
      top: false,
      child: Form(
        key: _formKey,
        child: Column(
          children: [
            Expanded(
              child: SingleChildScrollView(
                physics:
                const BouncingScrollPhysics(),
                padding:
                const EdgeInsets.fromLTRB(
                  24,
                  20,
                  24,
                  24,
                ),
                child: Column(
                  crossAxisAlignment:
                  CrossAxisAlignment
                      .start,
                  children: [
                    // =====================================
                    // HEADER
                    // =====================================

                    Row(
                      children: [
                        Material(
                          color:
                          Colors.grey.shade100,
                          borderRadius:
                          BorderRadius
                              .circular(
                            14,
                          ),
                          child: InkWell(
                            borderRadius:
                            BorderRadius
                                .circular(
                              14,
                            ),
                            onTap: () =>
                                goBack(ref),
                            child: Container(
                              width: 46,
                              height: 46,
                              alignment:
                              Alignment
                                  .center,
                              child:
                              const Icon(
                                Icons
                                    .arrow_back_ios_new_rounded,
                                size: 18,
                              ),
                            ),
                          ),
                        ),

                        const SizedBox(
                            width: 16),

                        Expanded(
                          child: Column(
                            crossAxisAlignment:
                            CrossAxisAlignment
                                .start,
                            children: [
                              Text(
                                "Your Details",
                                style: theme
                                    .textTheme
                                    .headlineMedium
                                    ?.copyWith(
                                  fontWeight:
                                  FontWeight
                                      .w800,
                                  letterSpacing:
                                  -0.8,
                                ),
                              ),

                              const SizedBox(
                                  height:
                                  4),

                              Text(
                                "Enter your contact information for the booking confirmation.",
                                style:
                                TextStyle(
                                  color: Colors
                                      .grey
                                      .shade600,
                                  fontSize:
                                  14.5,
                                  height:
                                  1.45,
                                  fontWeight:
                                  FontWeight
                                      .w500,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(
                        height: 30),

                    // =====================================
                    // PROFILE CARD
                    // =====================================

                    Container(
                      padding:
                      const EdgeInsets.all(
                        20,
                      ),
                      decoration:
                      BoxDecoration(
                        gradient:
                        const LinearGradient(
                          colors: [
                            Color(
                              0xFF111111,
                            ),
                            Color(
                              0xFF2A2A2A,
                            ),
                          ],
                        ),
                        borderRadius:
                        BorderRadius
                            .circular(
                          28,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors
                                .black
                                .withOpacity(
                              0.14,
                            ),
                            blurRadius:
                            22,
                            offset:
                            const Offset(
                              0,
                              10,
                            ),
                          ),
                        ],
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 68,
                            height: 68,
                            decoration:
                            BoxDecoration(
                              color: Colors
                                  .white12,
                              borderRadius:
                              BorderRadius
                                  .circular(
                                22,
                              ),
                            ),
                            child:
                            const Icon(
                              Icons
                                  .person_rounded,
                              color: Colors
                                  .white,
                              size: 32,
                            ),
                          ),

                          const SizedBox(
                              width: 18),

                          Expanded(
                            child: Column(
                              crossAxisAlignment:
                              CrossAxisAlignment
                                  .start,
                              children: const [
                                Text(
                                  "Customer Information",
                                  style:
                                  TextStyle(
                                    color: Colors
                                        .white,
                                    fontSize:
                                    18,
                                    fontWeight:
                                    FontWeight
                                        .w700,
                                  ),
                                ),

                                SizedBox(
                                    height:
                                    6),

                                Text(
                                  "Your information is securely used only for booking confirmation and communication.",
                                  style:
                                  TextStyle(
                                    color: Colors
                                        .white70,
                                    fontSize:
                                    13.5,
                                    height:
                                    1.45,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(
                        height: 32),

                    // =====================================
                    // FORM SECTION
                    // =====================================

                    const Text(
                      "Personal Information",
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight:
                        FontWeight.w700,
                      ),
                    ),

                    const SizedBox(
                        height: 18),

                    _ModernField(
                      controller:
                      nameController,
                      hint:
                      "Full Name",
                      icon: Icons
                          .person_outline_rounded,
                      textInputAction:
                      TextInputAction
                          .next,
                      validator:
                          (value) {
                        if (value == null ||
                            value
                                .trim()
                                .isEmpty) {
                          return "Please enter your full name";
                        }

                        return null;
                      },
                    ),

                    const SizedBox(
                        height: 18),

                    _ModernField(
                      controller:
                      emailController,
                      hint:
                      "Email Address",
                      icon: Icons
                          .mail_outline_rounded,
                      keyboardType:
                      TextInputType
                          .emailAddress,
                      textInputAction:
                      TextInputAction
                          .next,
                      validator:
                          (value) {
                        if (value == null ||
                            value
                                .trim()
                                .isEmpty) {
                          return "Please enter your email";
                        }

                        if (!RegExp(
                          r'^[^@]+@[^@]+\.[^@]+',
                        ).hasMatch(
                          value,
                        )) {
                          return "Enter a valid email address";
                        }

                        return null;
                      },
                    ),

                    const SizedBox(
                        height: 18),

                    _ModernField(
                      controller:
                      phoneController,
                      hint:
                      "Phone Number",
                      icon: Icons
                          .phone_outlined,
                      keyboardType:
                      TextInputType
                          .phone,
                      inputFormatters: [
                        FilteringTextInputFormatter
                            .allow(
                          RegExp(
                            r'[0-9+\-\s()]',
                          ),
                        ),
                      ],
                      textInputAction:
                      TextInputAction
                          .next,
                      validator:
                          (value) {
                        if (value == null ||
                            value
                                .trim()
                                .isEmpty) {
                          return "Please enter your phone number";
                        }

                        return null;
                      },
                    ),

                    const SizedBox(
                        height: 18),

                    _ModernField(
                      controller:
                      notesController,
                      hint:
                      "Additional Notes",
                      icon: Icons
                          .notes_rounded,
                      maxLines: 5,
                      textInputAction:
                      TextInputAction
                          .done,
                    ),

                    const SizedBox(
                        height: 22),

                    // =====================================
                    // SAVE DETAILS
                    // =====================================

                    AnimatedContainer(
                      duration:
                      const Duration(
                        milliseconds:
                        220,
                      ),
                      padding:
                      const EdgeInsets.all(
                        18,
                      ),
                      decoration:
                      BoxDecoration(
                        color: saveDetails
                            ? Colors
                            .black
                            .withOpacity(
                          0.03,
                        )
                            : Colors
                            .grey
                            .shade50,
                        borderRadius:
                        BorderRadius
                            .circular(
                          22,
                        ),
                        border: Border.all(
                          color:
                          Colors.grey
                              .shade200,
                        ),
                      ),
                      child: Row(
                        children: [
                          GestureDetector(
                            onTap: () {
                              setState(() {
                                saveDetails =
                                !saveDetails;
                              });
                            },
                            child:
                            AnimatedContainer(
                              duration:
                              const Duration(
                                milliseconds:
                                220,
                              ),
                              width: 24,
                              height: 24,
                              decoration:
                              BoxDecoration(
                                color: saveDetails
                                    ? Colors
                                    .black
                                    : Colors
                                    .white,
                                borderRadius:
                                BorderRadius.circular(
                                  8,
                                ),
                                border:
                                Border.all(
                                  color: saveDetails
                                      ? Colors
                                      .black
                                      : Colors
                                      .grey
                                      .shade400,
                                ),
                              ),
                              child:
                              saveDetails
                                  ? const Icon(
                                Icons
                                    .check,
                                color:
                                Colors.white,
                                size:
                                16,
                              )
                                  : null,
                            ),
                          ),

                          const SizedBox(
                              width: 14),

                          Expanded(
                            child: Column(
                              crossAxisAlignment:
                              CrossAxisAlignment
                                  .start,
                              children: [
                                const Text(
                                  "Save my details",
                                  style:
                                  TextStyle(
                                    fontWeight:
                                    FontWeight
                                        .w700,
                                    fontSize:
                                    15,
                                  ),
                                ),

                                const SizedBox(
                                    height:
                                    4),

                                Text(
                                  "Use this information for faster bookings next time.",
                                  style:
                                  TextStyle(
                                    color: Colors
                                        .grey
                                        .shade600,
                                    fontSize:
                                    13.5,
                                    height:
                                    1.4,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // =====================================
            // CONTINUE BUTTON
            // =====================================

            Padding(
              padding:
              const EdgeInsets.fromLTRB(
                24,
                0,
                24,
                24,
              ),
              child: SizedBox(
                width: double.infinity,
                height: 58,
                child: ElevatedButton(
                  onPressed: () {
                    FocusScope.of(
                      context,
                    ).unfocus();

                    if (!_formKey
                        .currentState!
                        .validate()) {
                      return;
                    }

                    ref
                        .read(
                      bookingProvider
                          .notifier,
                    )
                        .setCustomer({
                      "name":
                      nameController
                          .text
                          .trim(),

                      "email":
                      emailController
                          .text
                          .trim(),

                      "phone":
                      phoneController
                          .text
                          .trim(),

                      "notes":
                      notesController
                          .text
                          .trim(),

                      "saveDetails":
                      saveDetails,
                    });

                    goNext(ref);
                  },
                  style:
                  ElevatedButton.styleFrom(
                    elevation: 0,
                    backgroundColor:
                    Colors.black,
                    foregroundColor:
                    Colors.white,
                    shape:
                    RoundedRectangleBorder(
                      borderRadius:
                      BorderRadius
                          .circular(
                        20,
                      ),
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment:
                    MainAxisAlignment
                        .center,
                    children: [
                      const Text(
                        "Continue",
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight:
                          FontWeight
                              .w700,
                        ),
                      ),

                      const SizedBox(
                          width: 10),

                      Container(
                        width: 26,
                        height: 26,
                        decoration:
                        BoxDecoration(
                          color:
                          Colors.white12,
                          borderRadius:
                          BorderRadius
                              .circular(
                            30,
                          ),
                        ),
                        child: const Icon(
                          Icons
                              .arrow_forward_rounded,
                          size: 16,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// =========================================================
// MODERN FIELD
// =========================================================

class _ModernField extends StatelessWidget {
  final TextEditingController
  controller;

  final String hint;

  final IconData icon;

  final int maxLines;

  final TextInputType?
  keyboardType;

  final TextInputAction?
  textInputAction;

  final String? Function(String?)?
  validator;

  final List<TextInputFormatter>?
  inputFormatters;

  const _ModernField({
    required this.controller,
    required this.hint,
    required this.icon,
    this.maxLines = 1,
    this.keyboardType,
    this.textInputAction,
    this.validator,
    this.inputFormatters,
  });

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      maxLines: maxLines,
      keyboardType: keyboardType,
      textInputAction:
      textInputAction,
      validator: validator,
      inputFormatters:
      inputFormatters,

      style: const TextStyle(
        fontSize: 15.5,
        fontWeight: FontWeight.w600,
      ),

      decoration: InputDecoration(
        hintText: hint,

        hintStyle: TextStyle(
          color: Colors.grey.shade500,
          fontWeight: FontWeight.w500,
        ),

        prefixIcon: Padding(
          padding:
          const EdgeInsets.only(
            left: 14,
            right: 10,
          ),
          child: Icon(
            icon,
            color:
            Colors.grey.shade600,
          ),
        ),

        prefixIconConstraints:
        const BoxConstraints(
          minWidth: 52,
        ),

        filled: true,
        fillColor:
        Colors.grey.shade100,

        contentPadding:
        const EdgeInsets.symmetric(
          horizontal: 18,
          vertical: 20,
        ),

        border: OutlineInputBorder(
          borderRadius:
          BorderRadius.circular(
            22,
          ),
          borderSide: BorderSide(
            color:
            Colors.grey.shade200,
          ),
        ),

        enabledBorder:
        OutlineInputBorder(
          borderRadius:
          BorderRadius.circular(
            22,
          ),
          borderSide: BorderSide(
            color:
            Colors.grey.shade200,
          ),
        ),

        focusedBorder:
        OutlineInputBorder(
          borderRadius:
          BorderRadius.circular(
            22,
          ),
          borderSide: const BorderSide(
            color: Colors.black,
            width: 1.5,
          ),
        ),

        errorBorder:
        OutlineInputBorder(
          borderRadius:
          BorderRadius.circular(
            22,
          ),
          borderSide: BorderSide(
            color: Colors.red.shade400,
          ),
        ),

        focusedErrorBorder:
        OutlineInputBorder(
          borderRadius:
          BorderRadius.circular(
            22,
          ),
          borderSide: BorderSide(
            color: Colors.red.shade400,
            width: 1.5,
          ),
        ),
      ),
    );
  }
}