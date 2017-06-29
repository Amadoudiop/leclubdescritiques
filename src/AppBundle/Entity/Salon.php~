<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Salon
 *
 * @ORM\Table(name="salon")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\SalonRepository")
 */
class Salon
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     * @Assert\NotBlank()
     * @Assert\Length(min=5)
     * @ORM\Column(name="title", type="string", length=255)
     */
    private $title;

    /**
     * @var int
     *
     * @ORM\Column(name="participants_number", type="integer")
     */
    private $participants_number;

    /**
     * @var \DateTime
     *
     * @Assert\DateTime()
     */
    private $date_start;

    /**
     * @var \DateTime
     *
     * @Assert\DateTime()
     */
    private $date_end;

    /**
     * @ORM\ManyToOne(targetEntity="Oeuvre")
     * @ORM\JoinColumn(nullable=false)
     */
    private $oeuvre;

    /**
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\JoinColumn(nullable=false)
     */
    private $user;

    /**
     * @ORM\ManyToMany(targetEntity="User", cascade={"persist"})
     */
    private $participants;

    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set title
     *
     * @param string $title
     *
     * @return Salon
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Get title
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set dateStart
     *
     * @param string $dateStart
     *
     * @return Salon
     */
    public function setDateStart($dateStart)
    {
        $this->date_start = $dateStart;

        return $this;
    }

    /**
     * Get dateStart
     *
     * @return string
     */
    public function getDateStart()
    {
        return $this->date_start;
    }

    /**
     * Set dateEnd
     *
     * @param string $dateEnd
     *
     * @return Salon
     */
    public function setDateEnd($dateEnd)
    {
        $this->date_end = $dateEnd;

        return $this;
    }

    /**
     * Get dateEnd
     *
     * @return string
     */
    public function getDateEnd()
    {
        return $this->date_end;
    }

    /**
     * Set participantsNumber
     *
     * @param integer $participantsNumber
     *
     * @return Salon
     */
    public function setParticipantsNumber($participantsNumber)
    {
        $this->participants_number = $participantsNumber;

        return $this;
    }

    /**
     * Get participantsNumber
     *
     * @return int
     */
    public function getParticipantsNumber()
    {
        return $this->participants_number;
    }

    /**
     * Set oeuvre
     *
     * @param \AppBundle\Entity\Oeuvre $oeuvre
     *
     * @return Salon
     */
    public function setOeuvre(\AppBundle\Entity\Oeuvre $oeuvre = null)
    {
        $this->oeuvre = $oeuvre;

        return $this;
    }

    /**
     * Get oeuvre
     *
     * @return \AppBundle\Entity\Oeuvre
     */
    public function getOeuvre()
    {
        return $this->oeuvre;
    }

    /**
     * Set user
     *
     * @param \AppBundle\Entity\User $user
     *
     * @return Salon
     */
    public function setUser(\AppBundle\Entity\User $user)
    {
        $this->user = $user;

        return $this;
    }

    /**
     * Get user
     *
     * @return \AppBundle\Entity\User
     */
    public function getUser()
    {
        return $this->user;
    }
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->participants = new \Doctrine\Common\Collections\ArrayCollection();
    }

    /**
     * Add participant
     *
     * @param \AppBundle\Entity\User $participant
     *
     * @return Salon
     */
    public function addParticipant(\AppBundle\Entity\User $participant)
    {
        $this->participants[] = $participant;

        return $this;
    }

    /**
     * Remove participant
     *
     * @param \AppBundle\Entity\User $participant
     */
    public function removeParticipant(\AppBundle\Entity\User $participant)
    {
        $this->participants->removeElement($participant);
    }

    /**
     * Get participants
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getParticipants()
    {
        return $this->participants;
    }
}
